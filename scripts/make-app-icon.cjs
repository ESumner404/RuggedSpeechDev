// Draws the app icons from build/icon.svg, the Rugged Speech logo.
//
//   build/icon.png                          1024 by 1024. The rounded square sits inside a margin, as
//                                           app icons on a Mac are drawn, on a clear background.
//                                           electron-builder makes the Windows and Mac icon files from it.
//   ios/App/App/Assets.xcassets/.../AppIcon-512@2x.png
//                                           1024 by 1024, a full square with no corners and no clear
//                                           parts. iOS rounds the corners itself, and the App Store
//                                           refuses an icon with an alpha channel.
//
//   npx electron scripts/make-app-icon.cjs
const { app, BrowserWindow } = require('electron');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const root = join(__dirname, '..');
const svg = readFileSync(join(root, 'build', 'icon.svg'), 'utf8');
const iosIcon = join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-512@2x.png');

let win;

async function draw(html) {
  win ??= new BrowserWindow({ show: false, width: 1024, height: 1024, useContentSize: true, transparent: true, frame: false, webPreferences: { offscreen: true } });
  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const image = await win.webContents.capturePage({ x: 0, y: 0, width: 1024, height: 1024 });
  return image.resize({ width: 1024, height: 1024 });
}

/** Drops the alpha channel by way of JPEG, which has none. Uses the tool that ships with macOS. */
function withoutAlpha(png, target) {
  const dir = mkdtempSync(join(tmpdir(), 'rugged-icon-'));
  try {
    writeFileSync(join(dir, 'in.png'), png);
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '100', join(dir, 'in.png'), '--out', join(dir, 'mid.jpg')], { stdio: 'ignore' });
    execFileSync('sips', ['-s', 'format', 'png', join(dir, 'mid.jpg'), '--out', target], { stdio: 'ignore' });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const desktop = await draw(
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{position:absolute;left:100px;top:100px;width:824px;height:824px}</style>${svg}`,
  );
  writeFileSync(join(root, 'build', 'icon.png'), desktop.toPNG());
  console.log('Wrote build/icon.png', desktop.getSize());

  const square = svg.replace('rx="22"', 'rx="0"');
  const phone = await draw(
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#0F1E2E}svg{position:absolute;left:0;top:0;width:1024px;height:1024px}</style>${square}`,
  );
  withoutAlpha(phone.toPNG(), iosIcon);
  console.log('Wrote the iOS app icon');
  app.quit();
});
