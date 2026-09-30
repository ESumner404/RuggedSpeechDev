import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
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

// Must run before app is ready. This makes app:// a "standard, secure"
// scheme so window.isSecureContext is true in the packaged build — photo
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

const RENDERER_DIST = join(__dirname, '../renderer');
const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
let blockerId: number | null = null;

function registerAppScheme(): void {
  protocol.handle('app', async (request) => {
    const url = new URL(request.url);
    // app://renderer/<path>. An empty path serves index.html.
    let filePath = decodeURIComponent(url.pathname);
    if (filePath === '' || filePath === '/') {
      filePath = '/index.html';
    }
    try {
      const data = await readFile(join(RENDERER_DIST, filePath));
      const ext = filePath.split('.').pop() ?? '';
      const mimeTypes: Record<string, string> = {
        html: 'text/html',
        js: 'text/javascript',
        css: 'text/css',
        json: 'application/json',
        svg: 'image/svg+xml',
        png: 'image/png',
        woff2: 'font/woff2',
      };
      return new Response(data, {
        headers: { 'content-type': mimeTypes[ext] ?? 'application/octet-stream' },
      });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  });
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: isDev,
    },
  });

  Menu.setApplicationMenu(null);

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  win.once('ready-to-show', () => {
    win.maximize();
    win.show();
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
    registerAppScheme();

    // No feature ever fetches from the network (invariant I1). Deny it at
    // the session level so a stray dependency can't quietly start doing so.
    // Skipped in dev: the renderer itself is served from the Vite dev server.
    if (!isDev) {
      session.defaultSession.webRequest.onBeforeRequest(
        { urls: ['http://*/*', 'https://*/*'] },
        (_details, callback) => callback({ cancel: true }),
      );
    }

    // Camera/mic for Phase 4's photo and voice-clip capture — everything
    // else denied by default rather than left to Electron's own default.
    session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
      callback(permission === 'media');
    });

    ipcMain.handle('parent:set-fullscreen', (event, value: boolean) => {
      BrowserWindow.fromWebContents(event.sender)?.setFullScreen(value);
    });

    ipcMain.handle('parent:is-fullscreen', (event) => {
      return BrowserWindow.fromWebContents(event.sender)?.isFullScreen() ?? false;
    });

    // Backup is an explicit user action producing a file the adult controls
    // (CLAUDE.md I2) — a native save/open dialog, not a silent write
    // anywhere on disk. The renderer only ever hands over an opaque string
    // and gets one back; it never sees a filesystem path.
    ipcMain.handle('backup:save', async (event, data: string) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      const dialogOptions = {
        title: 'Save backup',
        defaultPath: `my-speech-backup-${new Date().toISOString().slice(0, 10)}.mwbackup`,
        filters: [{ name: 'My Speech 2 backup', extensions: ['mwbackup'] }],
      };
      const result = win
        ? await dialog.showSaveDialog(win, dialogOptions)
        : await dialog.showSaveDialog(dialogOptions);
      if (result.canceled || !result.filePath) return { ok: false as const };
      await writeFile(result.filePath, data, 'utf-8');
      return { ok: true as const };
    });

    ipcMain.handle('backup:restore', async (event) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      const dialogOptions = {
        title: 'Restore backup',
        filters: [{ name: 'My Speech 2 backup', extensions: ['mwbackup'] }],
        properties: ['openFile'] as Array<'openFile'>,
      };
      const result = win
        ? await dialog.showOpenDialog(win, dialogOptions)
        : await dialog.showOpenDialog(dialogOptions);
      if (result.canceled || result.filePaths.length === 0) return { ok: false as const };
      const data = await readFile(result.filePaths[0]!, 'utf-8');
      return { ok: true as const, data };
    });

    // Off by default (PLAN.md Phase 8) — this is a real Windows login-item
    // setting, not a preference this app stores itself, so it's read back
    // from the OS rather than cached in the renderer's own database.
    ipcMain.handle('startup:get-open-at-login', () => app.getLoginItemSettings().openAtLogin);
    ipcMain.handle('startup:set-open-at-login', (_event, value: boolean) => {
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
