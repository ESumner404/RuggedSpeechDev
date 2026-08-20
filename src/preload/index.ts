import { contextBridge } from 'electron';

// Deliberately narrow. The renderer is untrusted by construction (CLAUDE.md
// §3); add to this bridge only when a phase needs a specific main-process
// capability, and expose the narrowest function that provides it.
contextBridge.exposeInMainWorld('myWords', {
  versions: {
    app: process.env['npm_package_version'] ?? '0.0.0',
  },
});
