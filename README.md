# My Speech 2

**A communication companion for when speaking is difficult.**

My Speech 2 is an open-source AAC (augmentative and alternative communication) application for young autistic children, children with speech and language difficulties, and children and young people who stammer. It is a normal Windows desktop application: install it, double-click the icon, and it opens.

It is deliberately **not** positioned as "a device for non-verbal children". It is a companion for anyone whose speech is unavailable, unreliable or costly in the moment, including people who speak most of the time and reach for it only when they are stuck.

- **Using the app?** Read the [User Guide](docs/user-guide.md), or the one-page [Setup Sheet](docs/setup-sheet.md) to print out.
- **Working on the app?** Keep reading, then read [CLAUDE.md](CLAUDE.md) in full before changing code.

> **Status:** feature-complete against [PLAN.md](PLAN.md) phases 0 to 8, tested on macOS against packaged builds. It has **not yet been verified on real Windows hardware**, the installer is **not code-signed**, and the starter vocabulary has **not been reviewed by a speech and language therapist**. See [Known limitations](#known-limitations) before putting it in front of a child.

---

## Contents

- [What it does](#what-it-does)
- [The five invariants](#the-five-invariants)
- [Getting started (developers)](#getting-started-developers)
- [Commands](#commands)
- [Architecture](#architecture)
- [Project layout](#project-layout)
- [Data and privacy](#data-and-privacy)
- [Testing](#testing)
- [Building the Windows installer](#building-the-windows-installer)
- [Known limitations](#known-limitations)
- [What is deliberately not here](#what-is-deliberately-not-here)
- [Contributing](#contributing)
- [Licence](#licence)

---

## What it does

| Area | Summary |
| --- | --- |
| **Talk** | A grid of large buttons with folders (Food, Feelings, Play, People, Places, School). Build a sentence in the strip along the top, then press **Speak**. Fixed Home and Back buttons. |
| **Keyboard** | Full-screen keyboard with word prediction that only ever suggests. **Show** displays the text full-screen without speaking it, **No-pressure mode** strips the screen down, plus a personal phrase bank and conversation starters. |
| **Give me time** | One persistent button that speaks "I know what I want to say. Please give me a moment." from any screen. |
| **Feelings & Help** | Feelings (with *a little / medium / a lot*), a Help section, and a Calm section with a breathing guide and a quiet-time timer. |
| **My Day** | A visual plan for the day with Today and Now / Next / Later views, a "change of plan" announcement, and opt-in countdown warnings. |
| **My Pages** | Pages an adult builds from scratch for anything the starter vocabulary does not cover. |
| **Favourites and Recent** | One-press favourites, and an optional, off-by-default history. |
| **Medical Info** | An always-available button showing allergies, conditions and emergency contacts as text and as a QR code, with no PIN needed. |
| **Parent Mode** | Everything configurable lives behind a PIN: editing and reordering buttons (including drag and drop), folders, photographs, recorded voice clips, People and Places, the day plan, the Quick Access bar, profiles, access settings, backup and restore, and printing. |
| **Access** | Adjustable speech rate and pitch, a choice of what pressing a button does, hold-to-select (dwell), repeat-press suppression, one- and two-switch scanning, keyboard navigation, high contrast, text size and a low-arousal colour palette. |
| **Resilience** | Crash recovery (the sentence in progress and the current page come back), an encrypted-if-you-like backup file, and printable cards for when the machine is not available. |

Everything works with the network cable pulled out. See [the invariants](#the-five-invariants).

---

## The five invariants

These are not preferences; breaking one is a defect. The full reasoning is in [CLAUDE.md](CLAUDE.md).

1. **I1: It works with no network, forever.** No CDN assets, no web fonts, no telemetry, no crash reporting, no update check. If a feature cannot work offline, it does not ship.
2. **I2: Nothing about the child leaves the device.** No accounts, no cloud sync, no analytics, no automatic backup. Backup is an explicit action that produces a file the adult controls. Communication history is off by default.
3. **I3: Consistent position beats everything.** A button never moves. Grids do not reflow to fill gaps, and the grid size only changes when an adult changes it in Parent Mode.
4. **I4: The child's screen stays simple; complexity lives behind the PIN.** No settings gear on the child's screen.
5. **I5: Speech is never automatic.** Prediction suggests; the user chooses. Nothing speaks unless a person pressed something.

On I5: three features speak as the *continuation of a deliberate action* rather than from a fresh press. They are the Calm breathing guide and quiet-time timer (after **Start**), My Day's one-off "the plan has changed" announcement (after an adult saves an edit), and My Day's countdown warnings (**off by default**, only if an adult turns them on). Nothing else speaks unprompted.

---

## Getting started (developers)

**You need:** Node.js (a recent LTS release) and npm. You can develop on macOS, Windows or Linux. The app targets Windows 10 Pro, and the Windows installer can be cross-built from macOS (see [below](#building-the-windows-installer)).

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

---

## Architecture

An **Electron** desktop app: one target, one build, no browser.

- **Why Electron.** Chromium ships inside the installer, so there is no runtime dependency to go missing on a machine a child relies on (Tauri would be far smaller, but needs the WebView2 runtime). A privileged custom `app://` scheme gives the renderer a *secure context*, which camera capture (`getUserMedia`) requires and `file://` does not provide. IndexedDB in a packaged app has no quota prompt, which matters when families import hundreds of photographs.
- **Stack.** TypeScript (strict), Vite, **Preact** with signals, hand-written CSS with custom properties (no framework), and IndexedDB via `idb` for everything including photo blobs. The only runtime dependencies are Preact, `@preact/signals`, `idb` and `qrcode-generator` (zero sub-dependencies; it draws the Medical Info QR code offline).
- **Main process.** One window, `nodeIntegration: false`, `contextIsolation: true`, and a narrow `preload` bridge. No menu bar, no devtools in production, no `window.open`. A single-instance lock, and a `powerSaveBlocker` while the app is focused so the screen does not sleep mid-conversation.
- **Speech.** The Web Speech API, which in Chromium on Windows exposes the installed SAPI voices. Network-backed voices are filtered out, because they vanish when the wifi does. Recorded voice clips from Parent Mode play instead of the synthesiser when a button has one.
- **Symbols.** Emoji only. The `symbol` image type exists in the data model for Open Board Format compatibility, but nothing in the app ships or fetches a symbol pack.
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
    safety/        Medical Info button, overlay and QR text
    parent/        PIN gate, editors (boards, people/places, My Pages, access, ...)
    access/        Scanning, dwell, keyboard navigation, visual settings
    backup/        Backup file format and encryption, and the Backup tab
    print/         Printable cards and the sentence-strip template
    setup/         First-run wizard
    speech/        Speak, announce, and voice selection
    store/         IndexedDB layer, data types, Quick Access configuration
    ui/            Small shared pieces (colour key, photo thumbnail, QR code)
    vocab/         The starter vocabulary, as data rather than code
tests/e2e/         Playwright tests that run against the packaged app
docs/              User guide and the printable setup sheet
build/             NSIS installer customisation (keep or remove data on uninstall)
CLAUDE.md          The invariants and working rules. Read first.
PLAN.md            The phased build plan and acceptance criteria
DEVICE.md          Notes about the target machine (still to be filled in)
```

---

## Data and privacy

- Everything is stored locally in the app's IndexedDB. There is no server, no account and no network code.
- **Communication history ("Recent") is off by default.** When an adult turns it on it is capped (the latest 50 entries, kept for at most 7 days), has a visible **Clear** button, and can be switched off again.
- **The Help section is not a safeguarding record.** It speaks the phrase and stops. It does not log, flag or notify anyone, and does not store the phrase differently from anything else. A disclosure is handled by an adult following their setting's safeguarding procedure. "Call my parent" speaks those words; it does not place a call or send anything.
- **Backup is an explicit action** that writes one `.mwbackup` file through the operating system's save dialog. It contains everything, including photographs, medical information and the Parent PIN, so it can be protected with a passphrase (AES-GCM with a PBKDF2-derived key, using Web Crypto in the renderer). A lost passphrase cannot be recovered.
- The **Parent PIN is not device security.** It protects settings and editing. It does not lock the computer: Alt+Tab, the Windows key and Ctrl+Alt+Del all still work, and there is no supported way to change that on Windows 10 Pro without a different edition. The setup sheet says so plainly.
- If you are deploying this in a school or similar setting, you will probably need a **DPIA**: the app holds photographs of a child and their family, an emergency contact, and potentially a record of what they said.

---

## Testing

Per [CLAUDE.md](CLAUDE.md) §8, tests are written alongside the feature, and **end-to-end tests run against a packaged build**, not `npm run dev`. Path handling, the custom scheme and the preload bridge all behave differently once packed, and that is where this class of app breaks.

```bash
npm run verify     # typecheck, lint, unit tests (Vitest), build
npm run pack       # build the unpacked app the e2e tests drive
npm run test:e2e   # Playwright against release/
```

- **Unit tests** (Vitest, with `fake-indexeddb`) cover the pure logic and the components. Any test that touches the database, even indirectly through speech, needs a fresh `IDBFactory` and `resetDBConnectionForTests()`.
- **jsdom has no `PointerEvent`.** Gestures that depend on pointer events (the long-press to favourite, for example) are tested at the e2e layer.
- **E2E tests** launch the real packaged app with an isolated `--user-data-dir` per test, and use real Chromium input.
- One test (second launch focuses the existing window) is skipped on macOS by design.

---

## Building the Windows installer

```bash
npm run dist
```

This produces `release/My Speech 2 Setup <version>.exe`, a **per-user** NSIS installer that needs no administrator rights. It can be built from macOS or Linux. electron-builder cross-compiles it without Wine.

- **Code signing is not configured.** Without a certificate, Windows SmartScreen shows a "Windows protected your PC" warning on first run (users click **More info**, then **Run anyway**), and a school IT department may refuse an unsigned installer. Set `win.certificateFile` and `win.certificatePassword` (or the `CSC_LINK` / `CSC_KEY_PASSWORD` environment variables) in [electron-builder.yml](electron-builder.yml) before distributing widely. The certificate has a lead time, so start early.
- **Uninstall** asks whether to keep or remove the child's saved data. That script ([build/installer.nsh](build/installer.nsh)) has **not yet been exercised on real Windows**.
- **Updates are a new installer, handed over deliberately.** There is no auto-update, by design.

---

## Known limitations

Please read these before relying on the app with a real child.

- **Not yet verified on real Windows hardware.** Development and testing happened on macOS. Voice availability, screen size, touch and the NSIS uninstall flow all need checking on the target machine. [DEVICE.md](DEVICE.md) is the place to record what you find.
- **The installer is unsigned** (see above).
- **The starter vocabulary needs a speech and language therapist's review** before it reaches a child. Vocabulary choice is a clinical decision, and this project does not make it.
- **Voices are whatever Windows provides.** Neural voices (Piper, PLAN.md phase 9) and symbol libraries (phase 10) were deliberately not built; the app uses installed SAPI voices and emoji.
- **Narrator and other screen readers have not been verified.** Many controls carry ARIA labels, but there has been no full audit and nothing has been checked against a real screen reader.
- **There is no way to remove a Favourite in the interface yet.**
- **People and Places "phrases" are saved but not yet shown or spoken anywhere.** The name, photo, relationship and voice clip do become a working button; the comma-separated phrases are kept with the record for later use.
- **No "vocabulary level" setting.** Choosing which words suit which child is left to the adult (hide or add buttons) until a clinician defines levels.
- **Check the regulatory position** before making any clinical claim about outcomes; communication aids generally sit outside medical-device rules, but claims may not.

---

## What is deliberately not here

- Cloud sync, accounts, multi-device (violates I2).
- Automatic updates (violates I1's spirit: an offline app should not phone home).
- Kiosk or device lockdown. It is not achievable on Windows 10 Pro without Assigned Access (Edge and UWP only) or Shell Launcher (Enterprise and Education only), and a half-lock a child can defeat is worse than an honest open app.
- Any alerting or reporting built into the Help section, or location sharing (conflicts with the safeguarding position above, and with I1 and I2).
- Anything that acts without a press: automatic favouriting, auto-speaking predictions, and so on.

---

## Contributing

Contributions are welcome. A few rules come from the nature of the product:

1. **Read [CLAUDE.md](CLAUDE.md) first.** If a change appears to conflict with an invariant, stop and raise it rather than working around it.
2. **No network, ever.** No CDN assets, fonts, telemetry or update checks.
3. **No animation.** Motion is a sensory cost with no communicative benefit here. Use a static state change instead.
4. **Buttons must not move.** Anything that changes a layout must be an adult's deliberate action in Parent Mode.
5. **British English** in code comments, UI strings and documentation, and no jargon on anything a family sees (not "utterance", "vocalization" or "core vocabulary"). Avoid deficit framing: "What I need", not "problems".
6. **Write the Playwright test alongside the feature**, run `npm run verify`, and test against a packaged build.
7. **Say why you are adding a dependency** in the commit message. Every dependency is a liability on a machine that will never be updated.
8. Do not make it look like a toy. A fourteen-year-old must be willing to hold it in public.

---

## Licence

[MIT](LICENSE) © 2026 Ethan Sumner.
