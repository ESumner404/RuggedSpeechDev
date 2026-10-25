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
//   apple/TV/Assets.xcassets/App Icon & Top Shelf Image.brandassets
//                                           The Apple TV icons: layered (a back and a front, which the television
//                                           moves apart a little when the icon is focused), and the two top shelf pictures.
//
//   npx electron scripts/make-app-icon.cjs
const { app, BrowserWindow } = require('electron');
const { execFileSync } = require('node:child_process');
const { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const root = join(__dirname, '..');
const svg = readFileSync(join(root, 'build', 'icon.svg'), 'utf8');
const iosIcon = join(root, 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-512@2x.png');

let win;

async function draw(html, width = 1024, height = 1024) {
  win ??= new BrowserWindow({ show: false, width: 1024, height: 1024, useContentSize: true, transparent: true, frame: false, webPreferences: { offscreen: true } });
  win.setContentSize(width, height);
  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const image = await win.webContents.capturePage({ x: 0, y: 0, width, height });
  return image.resize({ width, height });
}

// The logo without its square, to sit on its own layer.
const glyph = svg.match(/<g transform="translate\(12 12\) scale\(0\.76\)">[\s\S]*<\/g>/)[0];
const NAVY = '#0F1E2E';

/** The logo centred in a picture of the given size, on a clear or navy background. */
function logoPicture(width, height, background, withLogo, wordmark = false) {
  const size = Math.round(height * (wordmark ? 0.62 : 0.8));
  const x = wordmark ? Math.round(width * 0.12) : Math.round((width - size) / 2);
  const y = Math.round((height - size) / 2);
  const text = wordmark
    ? `<text x="${x + size + Math.round(height * 0.06)}" y="${Math.round(height / 2 + height * 0.05)}" font-family="-apple-system, Helvetica, Arial" font-size="${Math.round(height * 0.16)}" font-weight="700" fill="#FFFFFF">Rugged Speech</text>`
    : '';
  return `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{position:absolute;left:0;top:0}</style>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
${background ? `<rect width="${width}" height="${height}" fill="${NAVY}"/>` : ''}
${withLogo ? `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 100 100">${glyph}</svg>` : ''}${text}</svg>`;
}

function writeJson(path, value) {
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function appleTvIcons() {
  const brand = join(root, 'apple', 'TV', 'Assets.xcassets', 'App Icon & Top Shelf Image.brandassets');
  const info = { author: 'xcode', version: 1 };
  writeJson(join(root, 'apple', 'TV', 'Assets.xcassets', 'Contents.json'), { info });
  writeJson(join(brand, 'Contents.json'), {
    assets: [
      { filename: 'App Icon - Large.imagestack', idiom: 'tv', role: 'primary-app-icon', size: '1280x768' },
      { filename: 'App Icon - Small.imagestack', idiom: 'tv', role: 'primary-app-icon', size: '400x240' },
      { filename: 'Top Shelf Image.imageset', idiom: 'tv', role: 'top-shelf-image', size: '1920x720' },
      { filename: 'Top Shelf Image Wide.imageset', idiom: 'tv', role: 'top-shelf-image-wide', size: '2320x720' },
    ],
    info,
  });

  // Layered icons: the front (the logo, clear all round) over the back (navy).
  for (const [name, sizes] of [
    ['App Icon - Large', [[1280, 768, '1x']]],
    ['App Icon - Small', [[400, 240, '1x'], [800, 480, '2x']]],
  ]) {
    const stack = join(brand, `${name}.imagestack`);
    writeJson(join(stack, 'Contents.json'), { layers: [{ filename: 'Front.imagestacklayer' }, { filename: 'Back.imagestacklayer' }], info });
    for (const [layer, background, withLogo] of [['Front', false, true], ['Back', true, false]]) {
      const set = join(stack, `${layer}.imagestacklayer`, 'Content.imageset');
      writeJson(join(stack, `${layer}.imagestacklayer`, 'Contents.json'), { info });
      mkdirSync(set, { recursive: true });
      const images = [];
      for (const [w, h, scale] of sizes) {
        const file = `${layer.toLowerCase()}-${scale}.png`;
        const picture = await draw(logoPicture(w, h, background, withLogo), w, h);
        writeFileSync(join(set, file), picture.toPNG());
        images.push({ idiom: 'tv', filename: file, scale });
      }
      writeJson(join(set, 'Contents.json'), { images, info });
    }
  }

  // The top shelf pictures: navy with the logo and the name.
  for (const [name, w, h] of [['Top Shelf Image', 1920, 720], ['Top Shelf Image Wide', 2320, 720]]) {
    const set = join(brand, `${name}.imageset`);
    mkdirSync(set, { recursive: true });
    const picture = await draw(logoPicture(w, h, true, true, true), w, h);
    withoutAlpha(picture.toPNG(), join(set, 'shelf-1x.png'));
    writeJson(join(set, 'Contents.json'), { images: [{ idiom: 'tv', filename: 'shelf-1x.png', scale: '1x' }], info });
  }
  console.log('Wrote the Apple TV icons');
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
  process.on('unhandledRejection', (error) => { console.error(error); app.exit(1); });
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
  await appleTvIcons();
  app.quit();
});
