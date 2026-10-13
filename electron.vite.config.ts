import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import preact from '@preact/preset-vite';
import type { Plugin } from 'vite';
import { CONTENT_SECURITY_POLICY } from './src/main/security';

// The desktop app sends its content policy as a header. The phone and tablet
// shells read the page straight from inside the app and send no headers, so the
// same policy is written into the built page as well (invariant I1: the page
// may load nothing from anywhere else). A page cannot set frame-ancestors from
// inside itself, and the shells have no frames, so that one is left out.
function contentPolicyInPage(): Plugin {
  const policy = CONTENT_SECURITY_POLICY.split('; ')
    .filter((directive) => !directive.startsWith('frame-ancestors'))
    .join('; ');
  return {
    name: 'content-policy-in-page',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: policy }, injectTo: 'head-prepend' },
    ],
  };
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/main',
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload',
    },
  },
  renderer: {
    root: 'src/renderer',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer'),
      },
    },
    plugins: [preact(), contentPolicyInPage()],
    build: {
      outDir: 'dist/renderer',
    },
  },
});
