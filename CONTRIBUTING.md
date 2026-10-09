# Contributing

Thank you for helping. Rugged Speech Test is a communication aid that a child may depend on, so a few rules matter more than they would in most projects.

## Before you start

1. Read [PRINCIPLES.md](PRINCIPLES.md) in full. It holds the five invariants (works offline, nothing leaves the device, buttons never move, the child's screen stays simple, speech is never automatic) and the reasons for them.
2. If a change appears to conflict with one of them, stop and open an issue rather than working around it.
3. Look at [the feature list](docs/features.md) and [what is deliberately not here](README.md#what-is-deliberately-not-here) so you do not build something that has been ruled out.

## Rules that come from the product

- **No network, ever.** No CDN assets, web fonts, telemetry, crash reporting or update checks.
- **No animation.** Motion is a sensory cost with no communicative benefit here. Use a static state change instead.
- **Buttons must not move.** Anything that changes a layout must be an adult's deliberate action in Parent Mode.
- **Colour has meaning.** Button colour shows the kind of word; do not use it for decoration.
- **British English** in code comments, UI strings and documentation. No jargon on anything a family sees (not "utterance", "vocalization" or "core vocabulary"). Avoid deficit framing: "What I need", not "problems".
- **Do not make it look like a toy.** A fourteen-year-old must be willing to hold it in public.
- **Safeguarding.** The app is not a safeguarding record. Nothing may log, flag or report the Help phrases differently from any other.

## Setting up

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite and Electron with hot reload |
| `npm run verify` | Type check, lint, unit tests and build. This is the gate. |
| `npm run pack` | An unpacked Electron build, for quick testing |
| `npm run test:e2e` | Playwright against the packaged app (run `npm run pack` first) |
| `npm run dist` | The Windows installer, into `release/` |
| `npm run dist:mac` | The two Mac disk images (Apple silicon and Intel), into `release/` |
| `npm run dist:all` | All three |

## Making a change

- Write the test alongside the feature: unit tests next to the code, and a Playwright test in `tests/e2e/` for anything a person can see.
- Run `npm run verify` and `npm run test:e2e` before opening a pull request. End-to-end tests run against a **packaged** build, because path handling, the custom `app://` scheme and the preload bridge behave differently once packed.
- **Say why you are adding a dependency** in the commit message. Every dependency is a liability on a machine that will never be updated.
- Keep pull requests small and about one thing. Describe what a person using the app will notice.
- If you change what the app does, update [the guide](docs/user-guide.md) and [the feature list](docs/features.md) in the same pull request.

## The website

The page in `website/` is plain HTML. Its "Have a go" board uses the app's own starter words, folders and drawn symbols, in `website/board-data.js`. That file is generated: if you change the starter words or the symbols, run `npm run website:board` and commit the result. A unit test fails if the two drift apart.

## Releasing

A new version goes to Windows and Mac together. Change `version` in `package.json`, commit, then tag and push (`git tag v0.2.0 && git push origin v0.2.0`). The release workflow builds the Windows installer and both Mac disk images and makes a draft release with checksums; publish it once you have tried the files. Run `npm run pack` again before the end-to-end tests if you have just built a release locally, because a release build switches the debug port off, and the tests need it.

## Please do not

- Include any real child's name, photograph or details in an issue, a test or a screenshot.
- Report a security problem in public. See [SECURITY.md](SECURITY.md).

## Licence

By contributing you agree that your contribution is licensed under the [MIT licence](LICENSE).
