; Uninstall: offers to keep or remove the child's data (docs/build-plan.md Phase 8,
; "Uninstall leaves no orphaned data unless the user chose to keep it").
; electron-builder's own uninstaller deletes only the installed program
; files; it never touches %APPDATA% on its own, so without this the data
; would always be left behind regardless of what the family wants.
;
; NOT YET VERIFIED ON REAL WINDOWS HARDWARE, electron-builder's NSIS
; target can only be exercised properly on Windows. Confirm this dialog
; and both branches (keep / remove) on an actual Windows 10 Pro machine
; before relying on it.

; Electron's app.getPath('userData') resolves to %APPDATA%\<productName>,
; "Rugged Speech Test" here matches the productName in electron-builder.yml exactly.
; Hardcoded rather than an electron-builder NSIS variable: the available
; variable names for this vary by electron-builder version, and getting it
; wrong here would silently point RMDir at the wrong folder or none at all.
!macro customUnInstall
  MessageBox MB_YESNO "Keep this child's saved boards, photos and settings on this computer?" IDYES keepData IDNO removeData
  removeData:
    RMDir /r "$APPDATA\Rugged Speech Test"
    Goto uninstallDone
  keepData:
  uninstallDone:
!macroend
