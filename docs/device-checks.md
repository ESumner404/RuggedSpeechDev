# Device checks

Recorded from the actual target machine, not guessed. **Not yet filled in,
this repo was scaffolded on macOS; these three checks need running on the
Windows 10 Pro machine the app will actually live on.**

## Voices

Run on the target machine:

```powershell
Add-Type -AssemblyName System.Speech
(New-Object System.Speech.Synthesis.SpeechSynthesizer).GetInstalledVoices() | % { $_.VoiceInfo.Name }
```

| Voice name | en-GB? | Child-appropriate? | Notes |
| ---------- | ------ | ------------------- | ----- |
| _(pending)_ | | | |

Filter Phase 1's Web Speech output to `voice.localService !== false` only
(PRINCIPLES.md §3), expect most of this list to be network-dependent "Natural"
voices that disappear offline. This table is what justifies Phase 9 (Piper).

## Screen

- Resolution: _(pending)_
- Physical size: _(pending)_
- Touch: _(pending, yes/no)_
- Physical keyboard: _(pending, yes/no)_

Grid sizing (2×2 / 3×3 / 4×4 / 5×5) is chosen against this, not guessed.

## How to fill this in

On the target machine: run the PowerShell command above, note the screen
properties (Settings → System → Display, and Settings → System → Tablet PC
or Device Manager for touch/keyboard), and replace the "pending" rows.
