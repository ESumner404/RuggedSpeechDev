import { contextBridge, ipcRenderer } from 'electron';

// Deliberately narrow. The renderer is untrusted by construction (PRINCIPLES.md
// §3); add to this bridge only when a phase needs a specific main-process
// capability, and expose the narrowest function that provides it.
contextBridge.exposeInMainWorld('myWords', {
  versions: {
    app: process.env['npm_package_version'] ?? '0.0.0',
  },
  parentMode: {
    // Fullscreen is a BrowserWindow property, only settable from the main
    // process, it can't be done with a plain DOM/CSS API from the
    // renderer (PRINCIPLES.md §3: "Fullscreen is a toggle in Parent Mode").
    setFullscreen: (value: boolean): Promise<void> => ipcRenderer.invoke('parent:set-fullscreen', value),
    isFullscreen: (): Promise<boolean> => ipcRenderer.invoke('parent:is-fullscreen'),
  },
  backup: {
    // The native save/open dialog lives in the main process, the renderer
    // hands over an opaque string and never sees or picks a filesystem path
    // itself (docs/build-plan.md Phase 6).
    save: (data: string): Promise<{ ok: true } | { ok: false }> => ipcRenderer.invoke('backup:save', data),
    restore: (): Promise<{ ok: true; data: string } | { ok: false }> => ipcRenderer.invoke('backup:restore'),
  },
  files: {
    // One file of a named kind, through a native dialog. The renderer hands
    // over or receives only the text, never a path.
    save: (
      data: string,
      options: { suggestedName: string; filterName: string; extensions: string[] },
    ): Promise<{ ok: true } | { ok: false }> => ipcRenderer.invoke('files:save', data, options),
    open: (options: {
      filterName: string;
      extensions: string[];
    }): Promise<{ ok: true; data: string } | { ok: false }> => ipcRenderer.invoke('files:open', options),
  },
  startup: {
    // A real OS login-item setting (docs/build-plan.md Phase 8), only settable from
    // the main process.
    getOpenAtLogin: (): Promise<boolean> => ipcRenderer.invoke('startup:get-open-at-login'),
    setOpenAtLogin: (value: boolean): Promise<void> => ipcRenderer.invoke('startup:set-open-at-login', value),
  },
});
