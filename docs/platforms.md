# Platforms

Rugged Speech is one app on several kinds of device. This page says how that is built, what is done, and what each next device needs.

## How it is built

The whole app is one web page (Preact, TypeScript) in `src/renderer`. It never touches the computer directly. Everything it needs from the device goes through one small bridge, `window.myWords`, which has four groups of things: save and open a file, print, fullscreen, and start with the device.

Each kind of device wraps that same page in a small native **shell** that provides the bridge:

| Shell | Used for | Where it lives |
| --- | --- | --- |
| Electron | Windows, macOS | `src/main`, `src/preload` |
| Capacitor (native app around a web view) | iPhone, iPad; then Android and Fire OS | `ios/`, `capacitor.config.ts`, `src/renderer/platform` |

So a feature is written once, in the page, and arrives on every device that has a shell. A device that cannot do something says so in `capabilities` (for example, a phone has no fullscreen switch), and the page hides that control instead of showing one that does nothing.

What every shell must keep to (see [the principles](../PRINCIPLES.md)):

- **No network.** The page is read from inside the app. The content policy in `src/main/security.ts` is built into the page for shells that send no headers, and the iPhone and iPad app asks for no network permission and no exception to App Transport Security.
- **Nothing leaves the device** except a file an adult chooses to save or share.
- **Same words, same positions.** The shell must not change how the page lays out the child's screen.

## Where each device stands

| Device | State | What is left |
| --- | --- | --- |
| Windows 10 and 11 | Released | Not yet signed or tested on real hardware |
| macOS | Released | Not yet signed or notarised |
| **iPhone and iPad** | **Built and run on the iPad simulator; not yet on a real device** | See [iPhone and iPad](#iphone-and-ipad) |
| Android | Next | Add the Capacitor Android shell, give it the same four bridge groups, and test voices and storage |
| Amazon Fire OS | After Android | Fire tablets run Android, so the same shell; no Google services may be needed. Test on a Fire tablet |
| Apple Watch | Not started | See below |
| Apple TV | Not started | See below |

### Apple Watch and Apple TV

Neither has a web view, so the page cannot run there. They would be small native apps (SwiftUI) that share the same words with the iPhone or iPad app, not copies of the whole app.

- **Apple Watch** is a good fit for a few things a child needs in one press: Yes, No, Help, Break, and a handful of favourites, spoken on the watch or on the paired phone. It would be a companion to the iPhone app, with the words sent over the local Bluetooth link between the two (never the internet).
- **Apple TV** has no touch and is used from a distance with a remote, so it suits showing something rather than building a sentence: a visual timetable, First / Then, or the Show page, on a big screen. It needs its own design for moving between buttons with the remote.

Both need the iPhone and iPad app first, because they get their words from it.

## iPhone and iPad

One app for both, written for the iPad first (most children who use AAC on Apple devices use an iPad). It is a native app with the same page inside.

### Build and run

You need a Mac with Xcode (accept its licence once with `sudo xcodebuild -license accept`). If `xcode-select` still points at the command line tools, prefix the commands below with `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`.

```bash
npm install
npm run ios:open        # builds the page, copies it into the app, and opens Xcode
```

In Xcode, pick your team under **Signing & Capabilities**, choose an iPad or iPhone (or a simulator) and press Run. Running on a real device needs only a free Apple ID. TestFlight and the App Store need a paid Apple Developer account.

To build for the simulator from the command line (no signing needed):

```bash
npm run ios:simulator
```

### What the app does differently

- Always full screen. There is no Fullscreen switch and no "Start when the computer starts".
- **Save** (backups, usage files, shared pages) opens the iOS share sheet; choose **Save to Files**. **Open** shows the Files picker.
- **Print** uses the system print sheet (AirPrint).
- The screen is kept awake while the app is open, and speech plays even when the silent switch is on.
- Camera and microphone are asked for only when you take a photo or record a voice.
- A long press on a button holds it (to add a favourite) and does not open the system's copy menu.

### Apple accessibility

| Feature | What the app does |
| --- | --- |
| **Eye Tracking** (iPadOS and iOS 18 or later) | Works with no extra code: it is the system's own pointer and dwell, and every control here is a normal button. Parent Mode, **Access** says how to switch it on and to leave **Hold-to-select** at 0 if Eye Tracking's dwell is used. The app cannot see the gaze, and never asks for it. |
| **Switch Control** and **Voice Control** | Every button is a real button with a name. The always-there bar is a labelled navigation region and each screen is a `main` region. |
| **VoiceOver** | Same names, read aloud. |
| **Reduce Motion, Increase Contrast, Bold Text, text size** | Read from the device and added to the app's own settings, unless an adult turns **Follow this device's accessibility settings** off. The device can only ask for more: it never weakens a choice made in the app. |
| **Guided Access** | Detected and shown in Parent Mode. The app cannot start it: that is a deliberate choice by whoever holds the device, in Settings. |
| **Assistive Access** | The app declares full-screen support (`UISupportsFullScreenInAssistiveAccess`) so it fills the screen instead of sitting in a small frame. |
| **Haptics** | An optional short buzz on a press, off by default. |

Not done yet, and worth doing next, because both need a device to test on:

- **Personal Voice** (a person's own voice, made on the device, iOS 17 and later). The page speaks with the web speech API, which does not offer it. Using it means a native speech path in the Swift plugin (`AVSpeechSynthesizer`) and the voice list in Parent Mode.
- **Gaze from the camera inside the app** (ARKit). It would only help iPads with a TrueDepth camera and iOS before 18, and the system's Eye Tracking is more accurate and works on more devices, so it has been left out.

### Things to know

- **Run on the simulator, not yet on a real device.** The app builds with Xcode and has been run on the iPad Air simulator: first-run, the child's screens, Parent Mode with the PIN, saved data surviving a relaunch, the share sheet, the Files picker, and the device's text size and contrast being followed live. It has not been run on a real iPad or iPhone, so camera, microphone, sound, haptics, printing and Eye Tracking are still to be checked on one.
- **Voices.** iOS speaks with the voices installed on the device. For good offline voices, add an Enhanced or Premium voice in **Settings, Accessibility, Spoken Content, Voices**, before relying on it.
- **Saved data.** Words, photos and settings are kept inside the app. iOS can clear an app's web storage if the device is nearly out of space. Make a backup (Parent Mode, **Backup**) and keep it somewhere safe.
- **Large backups.** A backup with a great many photographs passes through the app as one piece of text, which is slow on an older iPad.
- **Locking the device.** On an iPad, **Guided Access** (Settings, Accessibility) really does stop a child leaving the app. This is stronger than anything the Windows or Mac app can do, and worth setting up. The Parent PIN on its own does not lock the device.
- **Wording.** The app says "this device" in place of "this computer". It does not yet say "iPad" or "iPhone".
- **Phones are tighter.** The child's screens fit an iPhone, but several of the adult screens in Parent Mode are laid out for a bigger screen. Use an iPad for set-up.

### TestFlight

TestFlight is how the app gets onto real iPads and iPhones for testing without the App Store. It needs things only the account holder can do:

1. **An Apple Developer Program membership** (paid, yearly), at [developer.apple.com](https://developer.apple.com/programs/).
2. **Sign Xcode in** to that account: Xcode, Settings, Accounts. This is what lets Xcode make the signing certificate and profile.
3. **An app record** in [App Store Connect](https://appstoreconnect.apple.com), under My Apps, New App, with the bundle identifier from `capacitor.config.ts` (`dev.ruggedspeech.app` unless you changed it).
4. **Your team ID** (ten letters and digits, in the Membership page).

Then, from this folder:

```bash
APPLE_TEAM_ID=ABCDE12345 npm run ios:testflight
```

That builds the page, makes a signed release archive, and uploads it. After Apple has processed it (a few minutes) it appears under **TestFlight** in App Store Connect. Add yourself as an internal tester and install it from the TestFlight app. External testers need a short Apple review first, and a privacy policy address.

Questions Apple asks on the first upload:

- **Export compliance.** The app uses encryption only for the optional backup passphrase, through the system's own cryptography. That normally counts as exempt, but it is a legal statement made by the account holder, so it is left for you to answer.
- **Privacy.** Data Not Collected, no tracking (see below).

### Adding the app to the App Store

The answers are simple, because nothing is collected: **Data Not Collected**, no tracking, no accounts. The camera and microphone descriptions the review asks for are already in `ios/App/App/Info.plist`, and the privacy manifest is `ios/App/App/PrivacyInfo.xcprivacy`. The bundle identifier is `dev.ruggedspeech.app`; change it in Xcode (and in `capacitor.config.ts`) before the first upload, because it cannot change afterwards.

## Apple Watch and Apple TV (first version, just built)

Native SwiftUI apps in `apple/Watch` and `apple/TV`, sharing the starter words in `apple/Shared/Vocabulary.swift` (generated from the app's own vocabulary by `npm run apple:vocabulary`). One Xcode project (`ios/App/App.xcodeproj`, made from `ios/App/project.yml` by XcodeGen, `npm run apple:project`) holds the iPhone and iPad app, the Watch app (embedded in it) and the Apple TV app.

- **Apple Watch:** Yes, No, Break, Toilet, Finished, Question, Say again and Give me time in a fixed grid, plus Help, Words (the Talk pages), Feelings and Favourites. Works alone, with no internet. It builds and installs on the watchOS simulator. Sending Favourites from the iPhone app (WatchConnectivity) is written on the watch side only; the iPhone side and the Parent Mode switch for it are still to do.
- **Apple TV:** Talk (sentence strip, fixed word grid, always-there bar), Feelings, Help, Traffic light and Settings, with a focus outline and no animation. It builds and installs on the tvOS simulator.
- **Not done yet:** their app icons (the TV needs layered icons), checking the screens by eye and with the remote on the simulators, an iPhone-simulator pass over Parent Mode at phone width, CI for the new targets, and TestFlight (needs the paid membership).
