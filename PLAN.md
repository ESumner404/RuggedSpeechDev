# PLAN.md — My Words

Phased build. Each phase is independently shippable and leaves the application
working. Do not begin a phase until the previous phase's acceptance criteria
pass against a **packaged build on the real machine**, not only `npm run dev`.

Read `CLAUDE.md` first.

---

## Phase 0 — Skeleton that installs

Half a day. The point is to prove the delivery mechanism before any product
exists, so that packaging is never the thing that surprises you at the end.

**Tasks**

1. Electron + Vite + TypeScript + Preact skeleton. One window, menu removed,
   `contextIsolation` on, narrow preload bridge.
2. Register the `app://` privileged scheme (standard, secure, supportFetchAPI)
   and load the renderer from it. Confirm `window.isSecureContext === true` in
   the packaged build — photo capture in Phase 4 depends on this and finding
   out then is expensive.
3. `electron-builder` NSIS target, **per-user install, no admin rights**.
   Produce an installer, run it on the target machine, confirm a Start menu
   entry and a working uninstall.
4. `npm run verify` wired and passing on an empty project.
5. On the target machine, enumerate installed voices:
   `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).GetInstalledVoices() | % { $_.VoiceInfo.Name }`
   Record which are en-GB and which are remotely child-appropriate. Expect
   disappointment; it justifies Phase 9.
6. Record screen size, resolution, whether it is touch, and whether there is a
   physical keyboard. Grid sizing follows from this.

**Acceptance**

- A one-page `DEVICE.md` recording voices, screen, input method.
- The installer runs on a standard user account with no elevation prompt.
- A packaged build opens a maximised window showing "hello", with no menu bar,
  no devtools and no browser chrome.
- Launching a second time focuses the existing window rather than opening a
  second one.

---

## Phase 1 — The core board

The thing that must work if nothing else does.

**Scope**

- IndexedDB store, OBF-shaped data model.
- Home screen: six large tiles — **Talk · Keyboard · My Day · Favourites ·
  My Pages · Feelings & Help**. Stub the ones later phases fill.
- Talk: symbol grid, folder navigation, Home and Back fixed in position.
- Sentence strip along the top; tap a chip to remove it; large Speak button.
- Grid sizes 2×2, 3×3, 4×4, 5×5, adult-set only.
- Press mode: speak immediately / add to sentence / both.
- Web Speech output, offline voices filtered, rate and pitch.
- Starter vocabulary: core words plus Food, Feelings, Play, People, Places,
  School — depth through folders, never more than one grid on screen.
- Emoji symbols only at this stage. Ships with zero assets to fetch.
- `powerSaveBlocker` while focused.

**Acceptance**

- A child can build "I want a drink" and hear it, offline, from a cold start
  of the installed app.
- Buttons occupy identical screen positions across restarts and page changes.
- Playwright, against the packaged app: navigate two folders deep, build a
  three-word sentence, assert the utterance string.
- Wifi off, cable out: everything above still passes.

---

## Phase 2 — Feelings, Help, and fast access

**Scope**

- **Feelings & Help** page: the emotion, sensory and physical set from the
  brief, plus intensity — *a little · medium · a lot* — appended to whatever
  was chosen ("I feel worried, a lot").
- **Help** section: lost, unsafe, hurt, unwell, call my parent, toilet,
  someone hurt me, don't touch me, I don't know where I am. Reachable in two
  presses from anywhere.
- **Quick Access bar**: six adult-configurable buttons persistent across the
  app. Default: Home · Help · Yes · No · Favourites · Keyboard.
- **Favourites** and **Recent**, both as real pages.

**Acceptance**

- Help is reachable in ≤ 2 presses from every screen. Assert this in a test
  that walks every route.
- Nothing in the Help section writes a distinguishable log entry (`CLAUDE.md`
  §6).
- Recent survives a restart; clearing it actually clears IndexedDB.

---

## Phase 3 — Keyboard, prediction, and the stammering features

**Scope**

- Full-screen keyboard, large keys, prediction bar above.
- Prediction: prefix match against the loaded vocabulary, plus a small
  hand-built bigram table for core words, plus frequency of actual use.
  Suggestions never auto-commit and never auto-speak.
- **Give me time** button — persistent, one press, speaks "I know what I want
  to say. Please give me a moment."
- **Show instead of speak** — renders the sentence full-screen at maximum
  size, silently, to be held up.
- **No-pressure mode** — a stripped screen containing keyboard, text box and
  Speak, nothing else.
- **Personal phrase bank** — saved phrases the user finds hard to say. Name,
  address, usual order, register answer.
- Conversation starters for phone, counter, school, meeting people.

**Acceptance**

- Give me time fires in one press from any screen, including mid-typing.
- Show-instead-of-speak produces no audio and is readable at arm's length.
- Prediction never changes the sentence without a press. Test explicitly.

---

## Phase 4 — Parent Mode, custom pages, photographs

The largest phase. Consider splitting 4a (Parent Mode + editing) and 4b
(photos + page builder) if it runs long.

**Scope**

- PIN gate: hold the padlock three seconds, then numeric PIN. Configurable,
  with a documented reset procedure for a forgotten PIN.
- Parent Mode: add/edit/hide/reorder buttons, create pages, create categories,
  hide vocabulary, set grid size and vocabulary level, toggle fullscreen.
- **Photograph capture and import.** Camera via `getUserMedia` where one
  exists — this is why the secure context in Phase 0 mattered. File import via
  the native dialog otherwise. Downscale to max 800px on the long edge and
  store as a blob. Photos of Mum, the actual car, the real classroom.
- Drag-and-drop reordering, with a keyboard-accessible fallback.
- **People** and **Places** as first-class records: name, photo, relationship,
  associated phrases. These feed both the boards and Phase 5.
- Custom voice clips: record a short clip and attach it to a button, so a
  familiar person's voice can say it instead of the synthesiser.

**Acceptance**

- A parent can, without instruction, add a photo of a family member and have
  it appear as a working button in under two minutes.
- Photo storage is quota-safe: importing 200 photos does not break the app.
  Test it.
- Export produces a self-contained file including photo blobs; import on a
  clean machine reproduces the board exactly.

---

## Phase 5 — My Day

The strongest differentiator in the brief. Do not cut it.

**Scope**

- Day builder: ordered activities, each with name, symbol or photo, time,
  location, person, description, optional spoken message.
- **Today** screen with the current activity visually distinct.
- **Now / Next / Later** simplified view; adult chooses which view is shown.
- Mark finished — moves to a completed section or crosses out.
- **Change of plan**: adult edits an item, app can show the old struck through
  and the new one, and speak "The plan has changed. We are going to Grandma's
  instead."
- Countdowns — 5 minutes, 30 minutes, 1 hour — spoken warnings at two minutes
  and one minute. **Off by default**, because for some children a visible
  countdown raises anxiety rather than lowering it.
- Tap an activity to ask: What's next? · When? · Where? · Who with? · Finished.

**Acceptance**

- Day survives restart and rolls over correctly at midnight.
- Countdown default is off; enabling it is a deliberate adult choice.
- A change of plan can be made in under 30 seconds by an adult standing up.

---

## Phase 6 — Profiles, backup, print

**Scope**

- Profiles: Home · School · Grandparents · Hospital. Same core vocabulary,
  different pages prioritised on the home screen.
- Backup and restore to a single file via the native save dialog. Optional
  passphrase encryption, since the file contains a child's photographs and
  contact details.
- Print via Electron's print API: board pages as physical cards at
  20/30/50/70mm with cut lines, and a sentence-strip template. Laminated cards
  are what get used when the machine is broken, charging or elsewhere.

**Acceptance**

- Switching profile does not lose sentence or history state.
- A restored backup on a clean machine is identical in content.
- Printed cards are the stated physical size when measured with a ruler.

---

## Phase 7 — Access

**Scope**

- Hold-to-select with configurable dwell (0–1500ms).
- Repeat-press suppression (0–2000ms).
- Switch access: row/column scanning, one-switch timed and two-switch stepped,
  driven by space and enter so any keyboard-emulating switch interface works.
- External keyboard navigation: arrows plus enter through the grid.
- ARIA labels on every control; verify with Narrator against the packaged app.
- High contrast, light and dark, text size, reduce motion, low-arousal palette.

**Acceptance**

- The whole application is operable with two switches and nothing else. Walk
  the full journey that way as a test.
- Narrator announces every button meaningfully.

---

## Phase 8 — Installer and first run

**Scope**

- `npm run dist` produces a signed NSIS installer. Get a code-signing
  certificate: without one, SmartScreen will warn on every install and a
  school IT department will refuse it. This has a lead time — start it during
  Phase 1, not here.
- Per-user install, no elevation. Start menu entry, desktop shortcut, proper
  uninstall that offers to keep or remove the child's data.
- **First-run wizard**, three screens and no more: choose a voice, choose a
  grid size, set the Parent PIN. Everything else is discoverable later.
- Optional "start when Windows starts" via `app.setLoginItemSettings`, off by
  default.
- Crash recovery: if the app closes unexpectedly, the sentence in progress and
  the current page are restored.
- A one-page printed setup sheet in plain language, including the PIN reset
  procedure and an explicit statement that the app does not lock the computer.

**Acceptance**

- A clean Windows 10 Pro machine goes from bare to working app by following
  the printed sheet only, in under ten minutes, by someone who has not seen
  the repo, without an administrator password.
- Uninstall leaves no orphaned data unless the user chose to keep it.
- Pulling the power and restarting returns to the board with data intact.

---

## Phase 9 — Voices worth using

**Scope**

- Piper spawned as a child process from the Electron main process, writing a
  WAV the renderer plays. No HTTP service, no Windows service, no port.
- Bundle several en-GB voices including at least one child voice and a
  northern English voice. A Barnsley child should not have to sound like a
  BBC continuity announcer to be understood.
- Cache synthesised audio for frequently used phrases so repeats are instant.
- Fall back to Web Speech automatically if the process fails to start. Speech
  must never fail because a binary is missing.
- Confirm the GPL-3.0 position for distribution before shipping (`CLAUDE.md`
  §3).

**Acceptance**

- Speech latency under 300ms for a short sentence on the target hardware.
- Renaming the Piper binary degrades to SAPI with no visible error.

---

## Phase 10 — Open symbols

Deliberately last. Emoji work offline from day one; symbols are an
improvement, not a dependency.

**Scope**

- Bundle **Mulberry** (CC BY-SA — commercial use permitted with attribution
  and share-alike, and the symbols must stay free of charge) as the default
  set. Ship the SVGs inside the installer; never fetch at runtime.
- Optional ARASAAC (CC BY-NC-SA, non-commercial only — check this against how
  the product is distributed before enabling it by default).
- Symbol picker in Parent Mode, searchable, with per-button override.
- Attribution surface in an About page. This is a licence condition, not a
  courtesy, and it must travel with printed output too.

**Acceptance**

- Every bundled symbol resolves with the network off.
- Attribution appears in the app and on printed card sheets.

---

## Repository shape

```
/src
  /main         electron main, window, scheme registration, tts spawn
  /preload      the narrow bridge, nothing else
  /renderer
    /app        shell, routing
    /board      grid, folders, sentence strip, navigation
    /speech     web speech adapter, piper adapter, voice selection
    /store      IndexedDB, OBF import/export, blob handling
    /day        my day
    /parent     PIN gate, editors, page builder
    /access     scanning, dwell, keyboard nav
    /vocab      starter vocabulary as data, not code
    /ui         primitives, tokens, theming
/resources      piper binary + voice models, bundled Mulberry SVGs, licences
/docs           printed setup sheet
/tests          Playwright
CLAUDE.md  PLAN.md  DEVICE.md
```

---

## What is deliberately not in v1

Say no to these out loud so they do not creep in.

- Cloud sync, accounts, multi-device. Violates invariant I2.
- Auto-update. An offline app that phones home for updates is not an offline
  app. Updates are a new installer, handed over deliberately.
- Kiosk or device lockdown. Not achievable on Windows 10 Pro without
  Assigned Access (Edge and UWP only) or Shell Launcher (Enterprise and
  Education only). Do not fake it with registry hacks — a half-lock that a
  child defeats is worse than an honest open app.
- Automatic favouriting or any suggestion that acts without a press.
- Vocabulary beyond what the child in front of you needs. Depth is added when
  a real user runs out, not speculatively.

---

## Before real children use it

Not code, but it belongs in the plan.

- A **DPIA** if a school deploys this. It holds photographs of a child and
  their family, an emergency contact, and potentially a record of what they
  said. That is special category territory under UK GDPR and a school will be
  asked about it.
- Get a **speech and language therapist** to review the starter vocabulary
  before it reaches a child. Vocabulary choice is a clinical decision and this
  plan does not make it.
- Establish whether making any clinical claim shifts this toward MHRA medical
  device classification. Communication aids generally sit outside it; claims
  about outcomes may not. Ask early rather than after launch.
- Decide the safeguarding position with the setting, in writing, before the
  Help section is used in anger.
- Start the **code-signing certificate** application during Phase 1. It is the
  single most likely thing to delay a launch, and an unsigned installer will
  be blocked by school IT.
