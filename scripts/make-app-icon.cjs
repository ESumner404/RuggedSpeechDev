// Draws build/icon.png (1024 by 1024) from build/icon.svg, the Rugged Speech logo: the
// rounded square sits inside a margin, as app icons on a Mac are drawn, on a clear
// background. electron-builder makes the Windows and Mac icon files from this picture.
//
//   npx electron scripts/make-app-icon.cjs
const { app, BrowserWindow } = require('electron');
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const svg = readFileSync(join(root, 'build', 'icon.svg'), 'utf8');

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false, width: 1024, height: 1024, useContentSize: true, transparent: true, frame: false, webPreferences: { offscreen: true } });
  const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{position:absolute;left:100px;top:100px;width:824px;height:824px}</style>${svg}`;
  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const image = await win.webContents.capturePage({ x: 0, y: 0, width: 1024, height: 1024 });
  writeFileSync(join(root, 'build', 'icon.png'), image.resize({ width: 1024, height: 1024 }).toPNG());
  console.log('Wrote build/icon.png', image.getSize());
  app.quit();
});
