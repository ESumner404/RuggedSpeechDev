# Rugged Speech Test

**A communication companion for when speaking is difficult.**

![The Talk page: big, coloured buttons with a picture and a word on each](docs/images/talk.png)

Rugged Speech Test is an open-source AAC (augmentative and alternative communication) application for young children with limited speech: autistic children, children with speech and language difficulties, and children and young people who stammer. It is a normal Windows desktop application: install it, double-click the icon, and it opens. **It never uses the internet. Nothing about the child ever leaves the computer.**

It is deliberately **not** positioned as "a device for non-verbal children". It is a companion for anyone whose speech is unavailable, unreliable or costly in the moment, including people who speak most of the time and reach for it only when they are stuck.

> **Status:** a working, tested application, built and tested on macOS against packaged builds, and the Windows and Mac builds are checked by the same automated tests. It has **not yet been verified on real Windows hardware**, the Windows installer and the Mac disk images are **not code-signed**, and the starter vocabulary has **not been reviewed by a speech and language therapist**. It has had a self-review against NHS speech and language therapy practice, but that is **not a clinical sign-off**. See [Known limitations](#known-limitations) before putting it in front of a child.

## Download and install

**You need:** a Windows 10 or Windows 11 computer or tablet (64-bit), or a Mac (Apple silicon or Intel). No internet connection, no account and no administrator password. The same app, and the same features, go out for both at every release.

### Windows

1. Get the installer, a single file called **`Rugged Speech Test Setup 0.0.1.exe`** (the number may be newer). It is built by `npm run dist` and saved in the `release` folder; see [Building the installers, and releasing](#building-the-installers-and-releasing).
2. Double-click it. If Windows shows **Windows protected your PC**, press **More info**, then **Run anyway**. (This appears because the installer is not yet signed with a paid certificate.)
3. Follow the steps. It installs just for you, and opens when it is done.
4. A short **set-up** asks about the voice, the size of the buttons, the pictures and a Parent PIN. Write down the **recovery code** it shows you.

To check a download, compare its SHA-256 code with the one you were given: `certutil -hashfile "Rugged Speech Test Setup 0.0.1.exe" SHA256`.

### Mac

1. Get the disk image for your Mac: **`Rugged-Speech-Test-0.0.1-mac-arm64.dmg`** for a Mac with Apple silicon (M1 or later), or **`-mac-x64.dmg`** for an Intel Mac. (Apple menu, **About This Mac**, says which.)
2. Open it and drag **Rugged Speech Test** onto **Applications**.
3. **The first time, a Mac will not open it by double-click**, because the app is not yet signed with an Apple Developer ID. Open it once, and when the Mac says it cannot be opened, go to **System Settings, Privacy & Security**, scroll down, and press **Open Anyway**. (On macOS 14 and earlier you can instead Control-click the app and choose **Open**.) After that it opens normally. Or, in Terminal, once: `xattr -dr com.apple.quarantine "/Applications/Rugged Speech Test.app"`.
4. A short **set-up** asks about the voice, the size of the buttons, the pictures and a Parent PIN. Write down the **recovery code** it shows you.

To check a download: `shasum -a 256 Rugged-Speech-Test-0.0.1-mac-arm64.dmg`, and compare it with `SHA256SUMS.txt`.

## Where to start

| You are | Read |
| --- | --- |
| **A parent or carer** | [Getting started: parents and carers](docs/getting-started-parents.md) |
| **A teacher, teaching assistant, SENCo or therapist** | [Getting started: teachers and staff](docs/getting-started-staff.md) |
| **Looking for everything it can do** | [The feature list](docs/features.md) |
| **Looking for how a feature works** | [The whole guide](docs/user-guide.md) (also inside the app, in Parent Mode, under **User guide**) |
| **Setting it up for someone else** | [The one-page setup sheet](docs/setup-sheet.md), to print |
| **Responsible for data protection or IT** | [Security notes](docs/security.md) |
| **A speech and language therapist reviewing it** | [Clinical review](docs/clinical-review.md) |
| **Working on the code** | Keep reading, then read [PRINCIPLES.md](PRINCIPLES.md) and [CONTRIBUTING.md](CONTRIBUTING.md) before changing code. |

![The Home screen, and Feelings & Help with My body](docs/images/home.png)
![Pointing to where it hurts, on a figure that looks like the child](docs/images/body-pointing.png)

---

## Contents

- [What it does](#what-it-does)
- [The five invariants](#the-five-invariants)
- [Getting started (developers)](#getting-started-developers)
- [Commands](#commands)
- [Architecture](#architecture)
- [Project layout](#project-layout)
- [Data and privacy](#data-and-privacy)
- [Security](#security)
- [Testing](#testing)
- [Building the installers, and releasing](#building-the-installers-and-releasing)
- [Known limitations](#known-limitations)
- [What is deliberately not here](#what-is-deliberately-not-here)
- [Contributing](#contributing)
- [Licence](#licence)

---

## What it does

A summary. The full list is in [docs/features.md](docs/features.md).

| Area | Summary |
| --- | --- |
| **Talk** | A four-by-four page of big, coloured word buttons, with folders (Food, Feelings, Play, People, Places, Doing) of nine or fewer. Build a sentence in the strip along the top, then press **Speak**, or have each word said as it is pressed. Fixed Home and Back buttons. A small set of first words for young children, not a dictionary. |
| **Drawn symbols or emoji** | An original set of simple, bold drawn symbols, or emoji, chosen at set-up and in **Look**. Pictures and words, pictures only, or words only. |
| **Keyboard** | Full-screen keyboard with word prediction that only ever suggests. **Show** displays the text full-screen without speaking it, **No-pressure mode** strips the screen down, plus a personal phrase bank and conversation starters. |
| **Give me time** | One persistent button that speaks "I know what I want to say. Please give me a moment." from any screen. |
| **Feelings & Help** | Feelings (with *a little / medium / a lot*), a Help section, a Calm section with a breathing guide and a quiet-time timer, and **My body**. |
| **My body** | Point to where it hurts, on a figure that looks like the child (boy, girl or non-binary; skin, hair, clothes; a wheelchair; a hijab, turban or kippah; hearing aids, feeding tube, pump, braces and other equipment), say how it feels and how much, and say it. Always dressed, and the private area is only ever "under my pants". |
| **Games** | Find the word, Snap, a sentence-building Rollercoaster, Draw, Jokes, Music (songs added from files, with playlists), a basic Piano, **Seasons** (words and games for times of the year and celebrations, which an adult can choose between, change and add to) and **Make a tree** (a Christmas tree to decorate). No clocks, no scores, no motion. |
| **Traffic light** | Shows, without a word, how much a child wants to be spoken to. |
| **My Day** | A visual plan for the day with Today and Now / Next / Later views, a "change of plan" announcement, opt-in countdown warnings, a **weekly routine**, a picture for each activity and a printable **visual schedule**. **First / Then** is a two-card version. |
| **My Pages** | Pages an adult builds from scratch, or starts from about twenty **ready-made templates**, which can be **shared between devices** as standard [Open Board Format](https://www.openboardformat.org/) (`.obf`) files. |
| **Favourites and Recent** | One-press favourites, and an optional, off-by-default history. |
| **Medical Info** | An always-available button showing allergies, conditions, medicines, emergency plan and contacts as text and as a QR code, with no PIN needed. The code is tested by decoding what is actually on screen. |
| **About me** | A one-page communication passport for anyone new to supporting the person, readable without a PIN and printable. |
| **Lost mode** | Covers the screen with "This is a critical communication device. Please return it to …". Only the PIN turns it off. |
| **Parent Mode** | Everything configurable lives behind a PIN, in a grouped menu, with the whole guide built in. |
| **School Mode** | A separate side for school staff, with its own button next to Parent Mode and its own **School PIN**, both switched on afterwards in Parent Mode. It has a **Today** page, pupil and school details, safeguarding, timetable, lesson pages, vocabulary, communication **targets**, session **notes**, an optional **activity log** with counts by hour, day, week and month, printable **handover** and **review** sheets, and classroom set-up. |
| **Favourite colours** | Pick pink, orange, red, yellow, green, turquoise, blue or purple and the whole app takes on that colour, or choose a calm, dark or high contrast look, or build your own. |
| **Learning** | **Word stages**, **focus words**, and an **opt-in word-count report**. |
| **Access** | Choice of voice, speed and pitch presets, volume, how a sentence is read out (including one word at a time), "say it like this" pronunciations, what pressing does, hold-to-select, repeat-press suppression, one- and two-switch scanning, keyboard navigation, high contrast, text size, a low-arousal palette, colour schemes and your own colours. |
| **Resilience** | Crash recovery, an encrypted-if-you-like backup file, and printable cards for when the machine is not available. |

Everything works with the network cable pulled out. See [the invariants](#the-five-invariants).

---

## The five invariants

These are not preferences; breaking one is a defect. The full reasoning is in [PRINCIPLES.md](PRINCIPLES.md).

1. **I1: It works with no network, forever.** No CDN assets, no web fonts, no telemetry, no crash reporting, no update check. If a feature cannot work offline, it does not ship.
2. **I2: Nothing about the child leaves the device.** No accounts, no cloud sync, no analytics, no automatic backup. Backup is an explicit action that produces a file the adult controls. Communication history is off by default.
3. **I3: Consistent position beats everything.** A button never moves. Grids do not reflow to fill gaps, and the grid size only changes when an adult changes it in Parent Mode.
4. **I4: The child's screen stays simple; complexity lives behind the PIN.** No settings gear on the child's screen.
5. **I5: Speech is never automatic.** Prediction suggests; the user chooses. Nothing speaks unless a person pressed something.

On I5: three features speak as the *continuation of a deliberate action* rather than from a fresh press. They are the Calm breathing guide and quiet-time timer (after **Start**), My Day's one-off "the plan has changed" announcement (after an adult saves an edit), and My Day's countdown warnings (**off by default**, only if an adult turns them on). Nothing else speaks unprompted.

---

## Getting started (developers)

**You need:** Node.js (a recent LTS release) and npm. You can develop on macOS, Windows or Linux. The app targets Windows 10 and 11 and macOS, and the Windows installer can be cross-built from macOS (see [below](#building-the-installers-and-releasing)).

```bash
git clone https://github.com/ESumner404/RuggedSpeechDev.git
cd RuggedSpeechDev
npm install
npm run dev        # Vite + Electron with hot reload
```

Before you call any change done, run the gate:

```bash
npm run verify     # typecheck + lint + unit tests + build
```

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite and Electron with hot reload. |
| `npm run verify` | Typecheck, lint, unit tests and build. **The gate.** |
| `npm run typecheck` | `tsc --noEmit` for the renderer, the Node side and the tests. |
| `npm run lint` | ESLint. |
| `npm run test:unit` | Vitest. |
| `npm run build` | Build main, preload and renderer into `dist/`. |
| `npm run pack` | An unpacked Electron build in `release/`, for quick testing. **Required before the e2e tests.** |
| `npm run test:e2e` | Playwright, driving the **packaged** app from `release/`. |
| `npm run dist` | The Windows NSIS installer, written to `release/`. |
| `npm run dist:mac` | A macOS `.dmg` (for local testing only; not a release channel). |
| `SCREENSHOTS=1 npx playwright test tests/e2e/screenshots.spec.ts` | Retakes the pictures in `docs/images` from the packaged app. |

---

## Architecture

An **Electron** desktop app: one target, one build, no browser.

- **Why Electron.** Chromium ships inside the installer, so there is no runtime dependency to go missing on a machine a child relies on (Tauri would be far smaller, but needs the WebView2 runtime). A privileged custom `app://` scheme gives the renderer a *secure context*, which camera capture (`getUserMedia`) requires and `file://` does not provide. IndexedDB in a packaged app has no quota prompt, which matters when families import hundreds of photographs.
- **Stack.** TypeScript (strict), Vite, **Preact** with signals, hand-written CSS with custom properties (no framework), and IndexedDB via `idb` for everything including photo blobs. The only runtime dependencies are Preact, `@preact/signals`, `idb` and `qrcode-generator` (zero sub-dependencies; it works out the Medical Info QR code offline, and the app draws it itself: always black on white with a full quiet zone, with text encoded as UTF-8). `jsqr` is a **development-only** dependency: the tests use it to decode the QR code and prove it scans.
- **Main process.** One window, `nodeIntegration: false`, `contextIsolation: true`, and a narrow `preload` bridge. No menu bar, no devtools in production, no `window.open`. A single-instance lock, and a `powerSaveBlocker` while the app is focused so the screen does not sleep mid-conversation.
- **Speech.** The Web Speech API, which in Chromium on Windows exposes the installed SAPI voices. Network-backed voices are filtered out, because they vanish when the wifi does. Recorded voice clips from Parent Mode play instead of the synthesiser when a button has one.
- **Symbols.** An original set of drawn symbols (`src/renderer/symbols`), made for this app as SVG on one grid with one outline weight, used in place of an emoji when the adult chooses drawn symbols; an emoji with no drawing shows as an emoji. Nothing is borrowed, licensed or fetched. The `symbol` image type in the data model is for Open Board Format compatibility.
- **Colour has meaning.** Button colour encodes word class (the Fitzgerald Key): people yellow, doing green, describing blue, things orange, places teal, social pink, little words purple, no/stop red. It is structure, not decoration.

### Data model

Boards are stored as a superset of [Open Board Format](https://www.openboardformat.org/) (`.obf` / `.obz`), using OBF field names wherever OBF has one, so a board can move to and from other open AAC tooling.

```ts
type Item = {
  id: string;
  label: string;                 // what is written on the button
  vocalization?: string;         // what is spoken, if different
  image?: ImageRef;
  background_color?: string;     // a Fitzgerald-key colour, not a free choice
  load_board?: { id: string };   // makes this button a folder
  hidden?: boolean;
};

type ImageRef =
  | { kind: 'emoji'; char: string }
  | { kind: 'symbol'; set: 'mulberry' | 'arasaac' | 'openmoji'; name: string }
  | { kind: 'photo'; blobId: string };   // IndexedDB, never a file path
```

Photographs are blobs in IndexedDB referenced by id, never filesystem paths, so a backup file is self-contained.

---

## Project layout

```
src/
  main/            Electron main process: window, app:// scheme, dialogs, startup setting
  preload/         The narrow bridge exposed to the renderer, and nothing else
  renderer/
    app/           App shell, Home, Quick Access bar, Feelings & Help, Favourites
    board/         Grid, buttons, sentence strip, Talk and My Pages screens
    keyboard/      On-screen keyboard, prediction, phrase bank, conversation starters
    day/           My Day: child screen, day builder, countdown and change-of-plan logic
    calm/          Breathing guide and quiet-time timer
    safety/        Medical Info, About me and Lost mode
    symbols/       The drawn symbols, and the picture that chooses between them and emoji
    body/          My body: the figure, the parts, and how pointing becomes a sentence
    game/          Games: find the word, snap, rollercoaster, jokes, seasons, make a tree
    draw/          Draw
    music/         Music and the piano
    school/        School Mode: its own screens, PIN and menu
    signals/       The traffic light
    guide/         The in-app guide: a small, safe Markdown reader and the guide tab
    parent/        PIN gate and every Parent Mode tab (boards, people/places, My Pages,
                   learning, school, about me, quick access, access, general, ...)
    access/        Scanning, dwell, keyboard navigation, visual settings
    backup/        Backup file format and encryption, and the Backup tab
    print/         Printable cards and the sentence-strip template
    setup/         First-run wizard
    speech/        Speak, announce, and voice selection
    store/         IndexedDB layer, data types, Quick Access configuration
    ui/            Small shared pieces (colour key, photo thumbnail, QR code)
    vocab/         The starter vocabulary, as data rather than code
tests/e2e/         Playwright tests that run against the packaged app
docs/              The guides, feature list, setup sheet, security notes, clinical review,
                   the original build plan, device checks, and docs/images
build/             NSIS installer customisation (keep or remove data on uninstall), and
                   the step that switches off unneeded Electron features
PRINCIPLES.md      The invariants and working rules. Read first.
CONTRIBUTING.md    How to change the code
SECURITY.md        How to report a security problem
.github/workflows Checks on every change, and the release for Windows and Mac
```

---

## Data and privacy

- Everything is stored locally in the app's IndexedDB. There is no server, no account and no network code.
- **The activity log is off by default** (Parent Mode or School Mode, Activity). When an adult turns it on it notes what was said and which screens were opened, with the time, for the retention period chosen (7, 30, 90 days or a year, never more than 20,000 entries). It has a visible **Clear** button and a hard off switch, is not part of a backup, and leaves the device only as a spreadsheet an adult chooses to save. Practice in games is not logged, and every phrase is logged the same way, the Help phrases included.
- **Communication history ("Recent") is off by default.** When an adult turns it on it is capped (the latest 50 entries, kept for at most 7 days), has a visible **Clear** button, and can be switched off again.
- **Word counts (Learning) are off by default** and are the one other place anything about use is kept: how many times each word was pressed each day, and nothing else (no sentences, no times of day). They stay on the device, are kept for 90 days, can be cleared or switched off at any time, are written into a backup if you make one, and leave the device only if an adult exports them to a spreadsheet. Every word button is counted identically, the Help phrases included.
- **The Help section is not a safeguarding record.** It speaks the phrase and stops. It does not log, flag or notify anyone, and does not store the phrase differently from anything else. A disclosure is handled by an adult following their setting's safeguarding procedure. "Call my parent" speaks those words; it does not place a call or send anything.
- **Backup is an explicit action** that writes one `.mwbackup` file through the operating system's save dialog. It contains everything, including photographs, medical information and the Parent PIN, so it can be protected with a passphrase (AES-GCM with a PBKDF2-derived key, using Web Crypto in the renderer). A lost passphrase cannot be recovered.
- The **Parent PIN is not device security.** It protects settings and editing. It does not lock the computer: Alt+Tab, the Windows key and Ctrl+Alt+Del all still work, and there is no supported way to change that on Windows 10 Pro without a different edition. The setup sheet says so plainly.
- If you are deploying this in a school or similar setting, you will probably need a **DPIA**: the app holds photographs of a child and their family, an emergency contact, and potentially a record of what they said.

---

## Security

The window is treated as untrusted. In short: **every request outside the app is refused** (the page can load only `app://` files, `data:` and `blob:`), a strict **Content-Security-Policy** allows no script but the app's own, the `app://` handler **cannot be made to read outside the app folder**, the page has **no Node** and a bridge of a few narrow functions whose sender and input are checked, navigation, new windows, frames and permissions are blocked, the Parent PIN and recovery code are kept as **salted hashes** with a wait after repeated wrong tries, **spellcheck is off** so typing never goes to a service, and in the Windows release build the Electron fuses that run the program as plain Node or open a debug port are **switched off**. Electron, electron-builder, Vite and Vitest are current, and the shipped (runtime) dependencies have no known vulnerabilities. The Playwright security tests check these against the packaged app. See [docs/security.md](docs/security.md) for the full account, including what is **not** protected (a four-digit PIN does not stop someone who can copy the files) and how to report a problem.

---

## Testing

Per [PRINCIPLES.md](PRINCIPLES.md) §8, tests are written alongside the feature, and **end-to-end tests run against a packaged build**, not `npm run dev`. Path handling, the custom scheme and the preload bridge all behave differently once packed, and that is where this class of app breaks.

```bash
npm run verify     # typecheck, lint, unit tests (Vitest), build
npm run pack       # build the unpacked app the e2e tests drive
npm run test:e2e   # Playwright against release/
```

- **Unit tests** (Vitest, with `fake-indexeddb`) cover the pure logic and the components. Any test that touches the database, even indirectly through speech, needs a fresh `IDBFactory` and `resetDBConnectionForTests()`.
- **jsdom has no `PointerEvent`.** Gestures that depend on pointer events (the long-press to favourite, for example) are tested at the e2e layer.
- **E2E tests** launch the real packaged app with an isolated `--user-data-dir` per test, and use real Chromium input.
- **E2E runs are hidden by default.** `playwright.config.ts` sets `RUGGED_SPEECH_HIDDEN_FOR_TESTS=1`, so the app never shows a window, takes focus, shows a Dock icon, or goes fullscreen on the machine running the tests. (Fullscreen is simulated in that mode, because real fullscreen would take over the whole display.) Set `RUGGED_SPEECH_HIDDEN_FOR_TESTS=0` to watch a run. Nothing outside the tests sets it.
- **The QR code is verified end to end.** `tests/e2e/qr-code.spec.ts` screenshots the code as the app really draws it (accented name, dark high-contrast mode on), reads that image back, and decodes it with a real QR decoder, checking that the text is exactly what was entered. The unit tests do the same for the generated SVG, including non-ASCII text and emoji (the library's own default scrambles those, which is why the app encodes UTF-8 itself).
- **Security tests** (`tests/e2e/security.spec.ts`) try path traversal, outside requests from the page and from the main process, new windows, navigation, inline script, permissions and stored-PIN checks against the packaged app.
- **The guide pictures** are retaken from the packaged app by `tests/e2e/screenshots.spec.ts` (only when `SCREENSHOTS=1`).
- One test (second launch focuses the existing window) is skipped on macOS by design.
- The fake database used by the unit tests cannot hold a real photograph, so anything involving real picture data (for example sharing a page with a photo) is covered by the end-to-end tests.

---

## Building the installers, and releasing

```bash
npm run dist       # the Windows installer
npm run dist:mac   # the two Mac disk images (Apple silicon and Intel)
npm run dist:all   # all three
```

This produces `release/Rugged Speech Test Setup <version>.exe`, a **per-user** NSIS installer that needs no administrator rights, and `release/win-unpacked/`, the same program unpacked. It can be built from macOS or Linux. electron-builder cross-compiles it without Wine. An `afterPack` step (`build/afterPack.cjs`) switches off the Electron fuses the app does not need; check them with `npx @electron/fuses read --app "release/win-unpacked/Rugged Speech Test.exe"`.

- **Code signing is not configured.** Without a certificate, Windows SmartScreen shows a "Windows protected your PC" warning on first run (users click **More info**, then **Run anyway**), and a school IT department may refuse an unsigned installer. Set `win.certificateFile` and `win.certificatePassword` (or the `CSC_LINK` / `CSC_KEY_PASSWORD` environment variables) in [electron-builder.yml](electron-builder.yml) before distributing widely. The certificate has a lead time, so start early.
- **Uninstall** asks whether to keep or remove the child's saved data. That script ([build/installer.nsh](build/installer.nsh)) has **not yet been exercised on real Windows**.
- **Updates are a new installer, handed over deliberately.** There is no auto-update, by design.

### The Mac build

`npm run dist:mac` makes `release/Rugged-Speech-Test-<version>-mac-arm64.dmg` and `-mac-x64.dmg`. It is the same app and the same code. The differences are small and deliberate: the menu bar cannot be removed on a Mac, so there is a tiny one (Hide, Quit and the editing shortcuts, so Cmd+C and Cmd+V work in text boxes), and closing the window leaves the app in the Dock, as Mac apps do. Voices are the ones macOS provides.

- **Not signed or notarised yet.** A Mac will not open it by double-click the first time (the README's install steps say what to do). To sign and notarise, set `MAC_CSC_LINK`, `MAC_CSC_KEY_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD` and `APPLE_TEAM_ID` as repository secrets and add `notarize: true` under `mac:` in [electron-builder.yml](electron-builder.yml). This needs an Apple Developer Program membership, so start early.
- **Where the data is:** `~/Library/Application Support/Rugged Speech Test`. Removing the app is dragging it to the Bin; delete that folder too if the child's data should go.

### Releasing to both

Every change is checked by [`.github/workflows/ci.yml`](.github/workflows/ci.yml) on Windows and macOS (type check, lint, unit tests, build, and the end-to-end tests against the packaged app). To release:

1. Change `version` in `package.json` and commit it.
2. Tag it and push the tag: `git tag v0.2.0 && git push origin v0.2.0`.
3. [`.github/workflows/release.yml`](.github/workflows/release.yml) builds the Windows installer and both Mac disk images on their own kinds of computer, writes `SHA256SUMS.txt`, and puts everything in a **draft** release. Nothing is public until you try the files and press **Publish**.

The workflows have been written but **have not yet run on GitHub**; expect to fix small things the first time.

---

## Known limitations

Please read these before relying on the app with a real child.

- **Not yet verified on real Windows hardware.** Development and testing happened on macOS. Voice availability, screen size, touch and the NSIS uninstall flow all need checking on the target machine. [docs/device-checks.md](docs/device-checks.md) is the place to record what you find.
- **The installer is unsigned** (see above).
- **The starter vocabulary needs a speech and language therapist's review** before it reaches a child. Vocabulary choice is a clinical decision, and this project does not make it.
- **Voices are whatever Windows provides.** Neural voices (Piper, docs/build-plan.md phase 9) and licensed symbol libraries (phase 10) were deliberately not built; the app uses installed SAPI voices, and its own drawn symbols or emoji. The drawn symbols cover the starter words and the Home and top-bar pictures; other emoji show as emoji.
- **Narrator and other screen readers have not been verified.** Many controls carry ARIA labels, but there has been no full audit and nothing has been checked against a real screen reader.
- **People and Places "phrases" become a page only when an adult asks.** **Make a page of these phrases** (in Parent Mode) turns them into a My Pages page; they are not shown anywhere on their own.
- **Word stages are a mechanism, not a curriculum.** The app does not decide which words belong in which stage; that is a clinical decision for an adult or therapist to make, and no word ships with a stage set.
- **School Mode is a second PIN, not a classroom system.** One device, one pupil, a Parent PIN and a School PIN. There are no pupil or individual staff accounts (everyone at school shares the School PIN), and the app cannot manage a class set.
- **A shared page carries one flat page.** A button that opened a folder in the original becomes an ordinary button, because the folder is not in the file. Colours from other software are not kept (colour here means the kind of word).
- **Clinical status.** The app has had a critical self-review against NHS speech and language therapy practice ([docs/clinical-review.md](docs/clinical-review.md)), which lists what was found and what is still for a registered clinician to decide. It has not been assessed by one, and it is not a medical device.
- **Music is files only.** There is no Spotify or Apple Music, because they need accounts and the internet.
- **My body** is a communication aid for pointing, not a pain assessment or a diagnostic tool.
- **Lost mode is a note on the screen, not a tracker.** There is no network, so nothing can find or lock a device from afar.
- **The data on the computer is not encrypted by the app.** Use Windows sign-in and disk encryption (such as BitLocker) to protect the device itself.
- **Check the regulatory position** before making any clinical claim about outcomes; communication aids generally sit outside medical-device rules, but claims may not.

---

## What is deliberately not here

- Cloud sync, accounts, multi-device (violates I2). Sharing a page is a file the adult saves and hands over, never an upload.
- Automatic updates (violates I1's spirit: an offline app should not phone home).
- Kiosk or device lockdown. It is not achievable on Windows 10 Pro without Assigned Access (Edge and UWP only) or Shell Launcher (Enterprise and Education only), and a half-lock a child can defeat is worse than an honest open app.
- Spotify, Apple Music or any streaming (accounts and internet).
- Any alerting or reporting built into the Help section, or location sharing (conflicts with the safeguarding position above, and with I1 and I2).
- Anything that acts without a press: automatic favouriting, auto-speaking predictions, and so on.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and [PRINCIPLES.md](PRINCIPLES.md) first: a few rules come from the nature of the product (no network, no animation, buttons never move, British English, a test alongside every feature).

To report a security problem, see [SECURITY.md](SECURITY.md).

---

## Licence

[MIT](LICENSE) © 2026 Ethan Sumner.
