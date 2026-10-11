import { buildMenuTemplate } from './menu';
import { join } from 'node:path';
import { readFile, stat, writeFile } from 'node:fs/promises';
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  powerSaveBlocker,
  protocol,
  session,
} from 'electron';
import {
  MAX_FILE_CHARS,
  SECURITY_HEADERS,
  isAllowedRequest,
  isBoolean,
  isTrustedSender,
  resolveInside,
  safeExtensions,
  safeFileName,
  safeLabel,
} from './security';

// Must run before app is ready. This makes app:// a "standard, secure"
// scheme so window.isSecureContext is true in the packaged build, photo
// capture in Phase 4 needs that.
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

// The folder the saved data lives in is named after this, so it must never change by accident.
app.setName('Rugged Speech Test');

const RENDERER_DIST = join(__dirname, '../renderer');
const isDev = !app.isPackaged;

// Automated tests set this so the app runs without ever appearing on the
// person's screen, taking focus, or going fullscreen (a real macOS fullscreen
// would take over the whole display). Nothing sets it in normal use.
const hiddenForTests = process.env['RUGGED_SPEECH_HIDDEN_FOR_TESTS'] === '1';
let fullscreenStandIn = false;

let mainWindow: BrowserWindow | null = null;
let blockerId: number | null = null;

const MIME_TYPES: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  json: 'application/json',
  svg: 'image/svg+xml',
  png: 'image/png',
  woff2: 'font/woff2',
};

function registerAppScheme(): void {
  protocol.handle('app', async (request) => {
    const url = new URL(request.url);
    // app://renderer/<path>. An empty path serves index.html. The path is
    // checked to stay inside the app's own folder: a request for ../ in any
    // spelling is refused, not served.
    const requested = url.pathname === '' || url.pathname === '/' ? '/index.html' : url.pathname;
    const filePath = resolveInside(RENDERER_DIST, requested);
    if (!url.host || url.host !== 'renderer' || !filePath) {
      return new Response('Not found', { status: 404, headers: SECURITY_HEADERS });
    }
    try {
      const data = await readFile(filePath);
      const ext = filePath.split('.').pop() ?? '';
      return new Response(data, {
        headers: { ...SECURITY_HEADERS, 'content-type': MIME_TYPES[ext] ?? 'application/octet-stream' },
      });
    } catch {
      return new Response('Not found', { status: 404, headers: SECURITY_HEADERS });
    }
  });
}

/** In development the page comes from the dev server on this computer. */
const DEV_ORIGIN = isDev && process.env['ELECTRON_RENDERER_URL'] ? new URL(process.env['ELECTRON_RENDERER_URL']).origin : undefined;

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      navigateOnDragDrop: false,
      // What a child types must never be sent to a spelling service.
      spellcheck: false,
      devTools: isDev,
      // A hidden window's timers would otherwise be throttled to once a
      // second, which breaks anything time-based under test.
      ...(hiddenForTests ? { backgroundThrottling: false } : {}),
    },
  });

  const menuTemplate = buildMenuTemplate(app.name, process.platform);
  Menu.setApplicationMenu(menuTemplate ? Menu.buildFromTemplate(menuTemplate) : null);

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  win.once('ready-to-show', () => {
    win.maximize();
    if (!hiddenForTests) win.show();
  });

  win.on('focus', () => {
    if (blockerId === null || !powerSaveBlocker.isStarted(blockerId)) {
      blockerId = powerSaveBlocker.start('prevent-display-sleep');
    }
  });

  win.on('blur', () => {
    if (blockerId !== null && powerSaveBlocker.isStarted(blockerId)) {
      powerSaveBlocker.stop(blockerId);
      blockerId = null;
    }
  });

  win.on('closed', () => {
    mainWindow = null;
  });

  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    void win.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    void win.loadURL('app://renderer/index.html');
  }

  return win;
}

// Every window the app ever makes is held to the same rules. The page may not
// navigate anywhere else, may not open another window, and may not attach a
// web view: it is one fixed page.
app.on('web-contents-created', (_event, contents) => {
  contents.on('will-navigate', (event, url) => {
    if (!isTrustedSender(url, DEV_ORIGIN)) event.preventDefault();
  });
  contents.on('will-redirect', (event, url) => {
    if (!isTrustedSender(url, DEV_ORIGIN)) event.preventDefault();
  });
  contents.on('will-attach-webview', (event) => event.preventDefault());
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  void app.whenReady().then(() => {
    if (hiddenForTests) app.dock?.hide();
    registerAppScheme();

    // No feature ever fetches from the network (invariant I1). Deny it at
    // the session level, for every kind of request, so a stray dependency or
    // a crafted file cannot quietly start doing so. Only the app's own
    // scheme and in-page data are let through (in development, also the dev
    // server on this computer).
    session.defaultSession.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, (details, callback) => {
      callback({ cancel: !isAllowedRequest(details.url, DEV_ORIGIN) });
    });

    // Camera and microphone for photos and recorded voices, for the app's own
    // page only. Everything else is refused, rather than left to Electron's
    // own default: location, notifications, USB, serial, clipboard reads and
    // the rest.
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
      callback(permission === 'media' && isTrustedSender(webContents.getURL(), DEV_ORIGIN));
    });
    session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
      return permission === 'media' && isTrustedSender(webContents?.getURL(), DEV_ORIGIN);
    });
    session.defaultSession.setDevicePermissionHandler(() => false);

    // Only the app's own page may ask the main process for anything.
    const trusted = (event: Electron.IpcMainInvokeEvent): boolean => isTrustedSender(event.senderFrame?.url, DEV_ORIGIN);
    const readLimited = async (path: string): Promise<string | undefined> => {
      const info = await stat(path);
      if (!info.isFile() || info.size > MAX_FILE_CHARS) return undefined;
      return readFile(path, 'utf-8');
    };

    ipcMain.handle('parent:set-fullscreen', (event, value: boolean) => {
      if (!trusted(event) || !isBoolean(value)) return;
      if (hiddenForTests) {
        fullscreenStandIn = value;
        return;
      }
      BrowserWindow.fromWebContents(event.sender)?.setFullScreen(value);
    });

    ipcMain.handle('parent:is-fullscreen', (event) => {
      if (!trusted(event)) return false;
      if (hiddenForTests) return fullscreenStandIn;
      return BrowserWindow.fromWebContents(event.sender)?.isFullScreen() ?? false;
    });

    // Backup is an explicit user action producing a file the adult controls
    // (PRINCIPLES.md I2), a native save/open dialog, not a silent write
    // anywhere on disk. The renderer only ever hands over an opaque string
    // and gets one back; it never sees a filesystem path.
    ipcMain.handle('backup:save', async (event, data: string) => {
      if (!trusted(event) || typeof data !== 'string' || data.length > MAX_FILE_CHARS) return { ok: false as const };
      const win = BrowserWindow.fromWebContents(event.sender);
      const dialogOptions = {
        title: 'Save backup',
        defaultPath: `rugged-speech-backup-${new Date().toISOString().slice(0, 10)}.mwbackup`,
        filters: [{ name: 'Rugged Speech Test backup', extensions: ['mwbackup'] }],
      };
      const result = win
        ? await dialog.showSaveDialog(win, dialogOptions)
        : await dialog.showSaveDialog(dialogOptions);
      if (result.canceled || !result.filePath) return { ok: false as const };
      await writeFile(result.filePath, data, 'utf-8');
      return { ok: true as const };
    });

    ipcMain.handle('backup:restore', async (event) => {
      if (!trusted(event)) return { ok: false as const };
      const win = BrowserWindow.fromWebContents(event.sender);
      const dialogOptions = {
        title: 'Restore backup',
        filters: [{ name: 'Rugged Speech Test backup', extensions: ['mwbackup'] }],
        properties: ['openFile'] as Array<'openFile'>,
      };
      const result = win
        ? await dialog.showOpenDialog(win, dialogOptions)
        : await dialog.showOpenDialog(dialogOptions);
      if (result.canceled || result.filePaths.length === 0) return { ok: false as const };
      const data = await readLimited(result.filePaths[0]!);
      if (data === undefined) return { ok: false as const };
      return { ok: true as const, data };
    });

    // Saving or opening one file of a named kind (a usage report, a shared
    // page). Same rule as backup: a native dialog the adult controls, and the
    // renderer only ever hands over or receives the file's text, it never
    // sees or chooses a path. The kind is a plain name and extension list.
    ipcMain.handle(
      'files:save',
      async (
        event,
        data: string,
        options: { suggestedName: string; filterName: string; extensions: string[] },
      ) => {
        if (!trusted(event) || typeof options !== 'object' || options === null) return { ok: false as const };
        const extensions = safeExtensions(options.extensions);
        if (typeof data !== 'string' || data.length > MAX_FILE_CHARS || extensions.length === 0) return { ok: false as const };
        const win = BrowserWindow.fromWebContents(event.sender);
        const dialogOptions = {
          title: 'Save',
          defaultPath: safeFileName(options.suggestedName, `rugged-speech.${extensions[0]}`),
          filters: [{ name: safeLabel(options.filterName, 'File'), extensions }],
        };
        const result = win
          ? await dialog.showSaveDialog(win, dialogOptions)
          : await dialog.showSaveDialog(dialogOptions);
        if (result.canceled || !result.filePath) return { ok: false as const };
        await writeFile(result.filePath, data, 'utf-8');
        return { ok: true as const };
      },
    );

    ipcMain.handle('files:open', async (event, options: { filterName: string; extensions: string[] }) => {
      if (!trusted(event) || typeof options !== 'object' || options === null) return { ok: false as const };
      const extensions = safeExtensions(options.extensions);
      if (extensions.length === 0) return { ok: false as const };
      const win = BrowserWindow.fromWebContents(event.sender);
      const dialogOptions = {
        title: 'Open',
        filters: [{ name: safeLabel(options.filterName, 'File'), extensions }],
        properties: ['openFile'] as Array<'openFile'>,
      };
      const result = win
        ? await dialog.showOpenDialog(win, dialogOptions)
        : await dialog.showOpenDialog(dialogOptions);
      if (result.canceled || result.filePaths.length === 0) return { ok: false as const };
      const data = await readLimited(result.filePaths[0]!);
      if (data === undefined) return { ok: false as const };
      return { ok: true as const, data };
    });

    // Off by default (docs/build-plan.md Phase 8), this is a real Windows login-item
    // setting, not a preference this app stores itself, so it's read back
    // from the OS rather than cached in the renderer's own database.
    ipcMain.handle('startup:get-open-at-login', (event) => (trusted(event) ? app.getLoginItemSettings().openAtLogin : false));
    ipcMain.handle('startup:set-open-at-login', (event, value: boolean) => {
      if (!trusted(event) || !isBoolean(value)) return;
      app.setLoginItemSettings({ openAtLogin: value });
    });

    mainWindow = createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createWindow();
      }
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
