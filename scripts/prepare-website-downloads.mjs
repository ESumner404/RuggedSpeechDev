// Copies the built installers from release/ into website/downloads/ under the fixed
// names the website's download buttons serve, and writes their checksums:
//
//   npm run dist:all && npm run website:downloads
//   cd website && vercel deploy --prod
//
// The folder is not kept in git (the files are over 100 MB); it is uploaded with the site.
import { copyFileSync, mkdirSync, readdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'release');
const to = join(root, 'website', 'downloads');
mkdirSync(to, { recursive: true });

const files = readdirSync(from);
const pick = (pattern) => files.filter((name) => pattern.test(name)).sort().at(-1);
const wanted = [
  [pick(/Setup .*\.exe$/), 'RuggedSpeech-Setup-Windows.exe'],
  [pick(/mac-arm64\.dmg$/), 'RuggedSpeech-Mac-AppleSilicon.dmg'],
  [pick(/mac-x64\.dmg$/), 'RuggedSpeech-Mac-Intel.dmg'],
];

const sums = [];
for (const [source, name] of wanted) {
  if (!source) {
    console.error(`Missing a build for ${name}. Run npm run dist:all first.`);
    process.exit(1);
  }
  copyFileSync(join(from, source), join(to, name));
  sums.push(`${createHash('sha256').update(readFileSync(join(to, name))).digest('hex')}  ${name}`);
  console.log(`${source} -> website/downloads/${name}`);
}
writeFileSync(join(to, 'SHA256SUMS.txt'), `${sums.join('\n')}\n`);
