# Security notes

This is a plain account of how Rugged Speech Test protects a child's information, what has been checked, and what has not. It is written for people responsible for data protection or IT (a school, a trust, a family's IT-minded relative), and for anyone reviewing the app.

> **In one line.** The app never goes online, keeps everything on the computer, and is built so that even if something inside the window went wrong, it could not reach the internet, read other files or run other programs. It is not a lock on the device, and it does not encrypt the saved data.

## What is protected, and from what

| What needs protecting | From | How |
| --- | --- | --- |
| Photographs of the child and family, medical details, what was said, the vocabulary they use | Leaving the computer | There is **no network code at all**, and the program refuses every request that is not to itself. No accounts, no sync, no analytics, no crash reports, no update check. The only ways anything leaves are files an adult saves on purpose. |
| The settings (what words exist, who the contacts are) | A child, or a curious person using the app | The **Parent PIN**, kept as a salted hash, with a wait after repeated wrong tries. |
| The computer | Something going wrong in the app's window | The window has no access to the computer beyond a few narrow, checked actions. |
| A backup file | Being read by someone who is not meant to | An optional **passphrase** (AES-GCM with a key made by PBKDF2 from the passphrase, using the computer's own cryptography). |
| The installed program | Being turned into something else | The release build switches off Electron features the app does not need. |

## What is **not** protected

Please read this part. It matters more than the list above.

- **The PIN is not device security.** There are only ten thousand four-digit PINs. The PIN stops a child, or someone using the app, changing the settings. It cannot stop someone who can copy the computer's files. Windows sign-in and disk encryption such as BitLocker protect the device; the app does not replace them.
- **The saved data is not encrypted by the app.** It is kept in the app's own storage under the signed-in person's Windows profile. Anyone with access to that profile (or the disk) can read it. A backup file can be encrypted; the live data is not.
- **The PIN does not lock the computer.** A child can still switch to other programs. (There is no supported way to change that on Windows 10 Pro without a different edition.)
- **Lost mode is a note on the screen, not a tracker.** With no network, nothing can find, lock or wipe a device from afar.
- **About me and Medical Info are shown without the PIN, on purpose**, so a stranger who has found a child can read them. Only enter what you are comfortable with that.
- **The installer is not code-signed yet**, so Windows warns on first run. Signing is the next step before wide distribution.
- **It has not been tested on real Windows hardware yet**, and has not had an independent penetration test.

## What the program does

### Nothing goes online

- Every network request is **cancelled** by the main program before it leaves, whatever asked for it: the page, a script, an image, a font, a web socket. Only the program's own address scheme (`app://`), data inside the page (`data:`) and blobs (`blob:`) are allowed.
- A strict **Content-Security-Policy** is sent with every file, and allows nothing from any website: no outside script, style, image, font, frame, form target or connection. Inline script and `eval` are refused.
- There is no analytics, no crash reporting and no auto-update. Spell-checking is **off**, so what a child types is never sent to a spelling service.
- Music is files only. There is no Spotify or Apple Music, because those need accounts and the internet.

### The window cannot reach the computer

- **No Node.** The page runs in a sandbox with `contextIsolation` on and `nodeIntegration` off. `require`, `process` and `Buffer` do not exist in it.
- **A narrow bridge.** The page can ask the main program for a short, fixed list of things and nothing else: whether it is fullscreen and to set it, to save or open a backup, to save or open one file through a native dialog, and to read or set whether the app starts with Windows. Each is checked: it must come from the app's own page, the inputs must be the right type and size, and file names and extensions are cleaned. The page never sees or chooses a path: the person chooses it in the Windows file window.
- **Fixed page.** The window cannot navigate anywhere else, open another window, show a frame or attach a web view.
- **Fixed files.** The `app://` handler serves only files inside the app's own folder. A request for `../` in any spelling (`%2e%2e%2f`, backslashes, a NUL byte) is refused.
- **Permissions.** Only the camera and microphone, for photos and recorded voices, and only for the app's own page. Location, notifications, clipboard reading, USB and the rest are refused.
- **Single window, single instance.** No developer tools in the release build.

### The shipped program (Windows release build)

An `afterPack` step switches off these Electron "fuses", which an app like this never needs:

- running the program as a plain Node command (`RunAsNode`);
- Node options set from the environment (`NODE_OPTIONS`);
- the Node debug port (`--inspect`), **in the Windows build** (the Mac test build keeps it, because the automated tests drive the app through it);
- loading app code from anywhere but the packed app file (`OnlyLoadAppFromAsar` is on).

You can read the setting of a build yourself: `npx @electron/fuses read --app "release/win-unpacked/Rugged Speech Test.exe"`.

### The PIN, the recovery code and the backup

- The **Parent PIN**, the **School PIN** and the **recovery code** are not stored as typed. Each is kept as a salted PBKDF2 hash. The School PIN is a separate PIN for School Mode, switched on afterwards by the Parent PIN holder. It has no recovery code, and the Parent PIN holder can replace it. An older PIN saved as plain text still works, and is turned into a hash the first time it is used.
- After **five wrong PINs in a row** (counted separately for the Parent PIN and the School PIN) the keypad makes you wait (30 seconds, then longer, up to ten minutes). It also stops a child pressing numbers at random for ever.
- The **recovery code** is four words from a list of 64, drawn with the computer's secure random numbers (not `Math.random`), shown once.
- A **backup** can be protected with a passphrase: AES-GCM, key from PBKDF2 (SHA-256). A lost passphrase cannot be recovered.
- A **spreadsheet** of the activity log has cells that start with `=`, `+`, `-` or `@` marked so a spreadsheet cannot run them as formulas.

### Things shown on the screen

- The built-in guide is drawn from elements, not from text containing markup, so a guide file cannot contain a working script or link. Links to the internet are shown as words with the address, never opened.
- Drawn symbols are made of fixed drawings written for the app. They contain no script, link or address, and a test checks it.

## What has been checked

Automated tests run against the **packaged app** (`tests/e2e/security.spec.ts`) and the pure rules (`src/main/security.test.ts`, `src/renderer/store/pinSecurity.test.ts`):

- no `require`, `process` or `Buffer` in the page, and only the expected bridge;
- the policy and security headers are present, with no website named;
- path traversal in several spellings is refused, and an ordinary file is still served;
- requests to `https`, `http`, `wss` and a local address are blocked, **from the page and from the main process**;
- a whole first run and a visit round the app make **no request outside the app**;
- a new window, navigation to another site, an inline script and a frame are all blocked;
- location, notifications and clipboard are refused;
- the stored PIN is not the PIN.

**Dependencies.** The program that ships has **four** runtime dependencies (Preact, signals, idb, a QR-code library) and `npm audit --omit=dev` reports **no known vulnerabilities**. Electron is a current, supported release (the build was moved off an out-of-date Electron that had known Chromium vulnerabilities). The remaining audit findings are in the **build tools** (electron-builder and one library under it), are denial-of-service issues in tools that run on the developer's machine, and are **not part of the installed app**. They are tracked, and `npm audit` is part of the release check.

## Keeping it safe in practice

- Use a **Windows sign-in** on the computer, and **BitLocker** (or the equivalent) where it is available.
- Keep the **recovery code** somewhere safe, and **backups** on something that is kept safe, with a passphrase.
- Turn on **Lost mode** if the device is left somewhere.
- Keep Windows up to date. The app updates only when you install a new version yourself.
- In a school, do a **Data Protection Impact Assessment**: the app holds photographs of a child and their family, medical details and, if switched on, a record of what was said.
- The **activity log**, **Recent history** and **word counts** are all off until an adult turns them on. Each has a retention time, a clear button and an off switch. None is sent anywhere.

## Reporting a problem

If you find a security problem, please report it privately to the maintainer, Ethan Sumner (the contact on the project's GitHub page), rather than posting it in public, and include what you did and what happened. Please do not include any child's real information.
