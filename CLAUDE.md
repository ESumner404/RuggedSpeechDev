# CLAUDE.md — My Speech 2

A communication companion for when speaking is difficult.

Read this file in full before touching code. It contains the invariants. If a
task in `PLAN.md` appears to conflict with anything here, stop and raise it
rather than resolving it yourself.

---

## 1. What this is

An AAC (augmentative and alternative communication) application for young
autistic children, children with speech and language difficulties, and children
and young people who stammer.

It is deliberately **not** positioned as "a device for non-verbal children". It
is a companion for anyone whose speech is unavailable, unreliable or costly in
the moment. Some users will speak most of the time and reach for this only when
stuck. The product must never behave as though speaking has been given up on.

Target: **a normal desktop application on Windows 10 Pro.** Double-click an
icon, it opens. That is the whole deployment story.

## 2. The five invariants

These are not preferences. Breaking any of them is a defect.

### I1 — It works with no network, forever

Every core function works with the network cable pulled and the wifi radio off:
symbols, sentence building, keyboard, speech output, favourites, custom pages,
photographs, the day planner. No feature may sit behind a network call. No
lazy-loaded asset from a CDN. No font from Google. No telemetry, ever, not even
crash reporting. No auto-update check.

If a feature cannot work offline, it does not ship.

### I2 — Nothing about the child leaves the device

Photographs of the child's family, their emergency contact, their spoken
history, and the vocabulary they reach for are all sensitive. There is no
cloud sync, no account, no analytics, no auto-backup to anywhere. Backup is an
explicit user action producing a file the adult controls.

Communication history is off by default. When enabled it has a retention
period, a visible clear button, and a hard off switch.

### I3 — Consistent position beats everything

A button must not move. Once a child has learned that Home is bottom-left and
"more" is the last tile, that is load-bearing motor memory. Grids never reflow
to fill gaps. Pagination never resizes buttons. Changing grid size is an adult
action in a settings panel, never something that happens automatically because
of window size or item count.

Corollary: the window opens maximised and the layout is driven by the adult's
grid setting, not by whatever size the window happens to be.

### I4 — The child's screen stays simple; complexity lives behind the PIN

The child-facing surface is a handful of very large buttons and a navigation
bar. Everything configurable — page building, photos, schedules, voice,
vocabulary, access settings — is behind Parent Mode. No settings gear on the
child's screen.

### I5 — Speech is never automatic

Prediction suggests. The user chooses. Nothing speaks unless a person pressed
something. This matters for autonomy and it matters doubly for users who
stammer, for whom being spoken over is the core harm.

## 3. Architecture, and why

**An Electron desktop application. One target, one build, no browser.**

Rationale, since Electron is not the fashionable answer:

- **No runtime dependency.** Chromium ships inside the installer. Tauri would
  be a tenth of the size but depends on the WebView2 runtime, which is usually
  present on Windows 10 but not guaranteed — and "usually" is not good enough
  for a device a child depends on. Installer size is irrelevant for a local
  install; a broken first run is not.
- **Secure context.** Photo capture via `getUserMedia` requires one. Loading
  from `file://` does not provide it. Electron lets us register a privileged
  custom scheme, which does. This alone rules out the "just an HTML file"
  approach for anything past Phase 3.
- **Unrestricted storage.** IndexedDB in a packaged app has no quota prompt.
  Families will import hundreds of photographs.
- **Direct process spawn.** Phase 9's neural voices run as a child process,
  not an HTTP service. Far less to go wrong.

If installer size ever becomes a real constraint, Tauri with a **fixed-version**
bundled WebView2 is the fallback. Do not use the bootstrapper variant.

### Stack

- TypeScript, strict mode.
- Vite build, output to `dist/`, loaded by Electron over a registered
  `app://` scheme (standard, secure, no CORS surprises).
- **Preact** + signals. Not React. Small, fast, no build-time surprises.
- No CSS framework. Hand-written CSS with custom properties for theming.
- **IndexedDB** via `idb` for everything, including photo blobs.
- `electron-builder`, NSIS target, **per-user install so no admin rights are
  needed** — schools and families frequently cannot elevate.
- Zero runtime dependencies beyond the above. Every added dependency is a
  liability on a machine that will never be updated.

### Electron main process rules

- One window. `BrowserWindow` with `nodeIntegration: false`,
  `contextIsolation: true`, a narrow `preload` bridge. The renderer is
  untrusted by construction.
- Menu bar removed. No devtools in production. No `window.open`.
- `powerSaveBlocker` while the app is focused, so the screen never sleeps
  mid-conversation.
- Single instance lock — a second launch focuses the existing window.
- Fullscreen is a toggle in Parent Mode, not the default.

### What we are *not* doing, and what to tell people

This is a normal application. It **cannot stop a child leaving it** — Alt+Tab,
the Windows key and Ctrl+Alt+Del all still work, and there is no supported way
to change that on Windows 10 Pro without Assigned Access (Edge and UWP only on
Windows 10) or Shell Launcher (Enterprise and Education only).

The Parent PIN protects *settings and editing*. It does not lock the device.
Say that plainly in the setup sheet rather than implying a lock that does not
exist. If a setting later needs true lockdown, that is a different licence and
a different conversation, and the app is already built to survive it.

### Speech

Phase 1 uses the Web Speech API, which in Chromium on Windows exposes the
installed SAPI voices. Filter to `voice.localService !== false` by default —
the network-dependent "Natural" voices will vanish in a corridor.

Phase 9 adds Piper (neural, offline, ONNX) spawned as a child process from the
main process, writing a WAV the renderer plays. SAPI child voices are poor and
the brief explicitly asks for a voice that feels like the user's own. Note that
Piper development moved from the archived MIT-licensed `rhasspy/piper` to
`OHF-Voice/piper1-gpl` under **GPL-3.0**. Ship the binary alongside and invoke
it — do not link it. Confirm the licence position before distribution.

## 4. Data model

Boards are stored in a superset of **Open Board Format** (`.obf` / `.obz`).
Use OBF field names where OBF has one. This is not academic: it means a board
can move to and from CoughDrop and other open AAC tooling, and it means we are
not inventing a format that traps families.

```ts
type Item = {
  id: string;
  label: string;                 // what is written on the button
  vocalization?: string;         // what is spoken, if different
  image?: ImageRef;
  background_color?: string;     // Fitzgerald-key class, not a raw colour
  load_board?: { id: string };   // makes this a folder
  hidden?: boolean;
};

type ImageRef =
  | { kind: 'emoji'; char: string }
  | { kind: 'symbol'; set: 'mulberry' | 'arasaac' | 'openmoji'; name: string }
  | { kind: 'photo'; blobId: string };   // IndexedDB, never a file path
```

Photographs are blobs in IndexedDB, referenced by id. Never store a filesystem
path — the file may move, and a backup file must be self-contained.

## 5. Colour has meaning

Button colour encodes word class (the Fitzgerald Key). It is structure, not
decoration, and must not be repurposed for visual variety.

people = yellow · doing = green · describing = blue · things = orange ·
places = teal · social = pink · little words = purple · no/stop = red

## 6. Safeguarding

The Help section contains "Someone hurt me" and "I feel unsafe". These exist
because a child needs the words.

**The application is not a safeguarding record.** It speaks the phrase and
stops. It must not log that phrase specially, flag it, notify anyone, or store
it differently from any other utterance. A disclosure is handled by an adult
following their setting's safeguarding procedure. Building notification into
this would create an unregulated reporting channel and a false sense that
something has been actioned.

Emergency contact details entered in Parent Mode are shown only on an explicit
press, never on an idle screen a stranger could read.

## 7. Language and tone

British English throughout, in code comments, UI strings and documentation.

UI text is written for the child where the child will read it, and for a
harassed adult where the adult will. No jargon on either surface — not
"utterance", not "vocalization", not "core vocabulary" in anything the family
sees.

Do not make it look like a toy. A fourteen-year-old must be willing to hold it
in public. Large and clear, not cartoonish.

Avoid deficit framing in every string. "What I need", not "problems". "Too
loud in here", not "sensory issue". Stimming is a need to be met, not a
behaviour to be managed.

## 8. Working rules for Claude Code

- Work one phase at a time. Do not start a phase before its predecessor's
  acceptance criteria pass.
- Every phase ends with the app still fully functional. No half-migrated
  states left overnight on a machine a child might use.
- Write the Playwright test alongside the feature, not afterwards.
- Run `npm run verify` before declaring a task done. Do not report success on
  unverified code.
- Test against a **packaged build**, not only `npm run dev`. Path handling,
  the custom scheme and the preload bridge all behave differently once packed,
  and that is where this class of app breaks.
- When something in this file turns out to be wrong on the real hardware, say
  so and stop. Do not route around it.
- Do not add a dependency without saying why in the commit message.
- Do not add animation. Motion is a sensory cost with no communicative
  benefit here.

## 9. Commands

```
npm run dev        # Vite + Electron, hot reload
npm run verify     # typecheck + lint + unit tests + build. The gate.
npm run build      # renderer build into dist/
npm run pack       # unpacked Electron build, for quick testing
npm run dist       # signed NSIS installer into release/
npm run test:e2e   # Playwright against the packaged app
```
