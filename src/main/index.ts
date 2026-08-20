import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import {
  app,
  BrowserWindow,
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
