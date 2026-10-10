// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'out/**', 'release/**', 'node_modules/**', 'website/board-data.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    // Build scripts that run under Node, as plain CommonJS.
    files: ['build/**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', process: 'readonly', setTimeout: 'readonly', exports: 'writable', module: 'writable', __dirname: 'readonly' },
    },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // Helper scripts that run under Node as modules.
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: { console: 'readonly', globalThis: 'readonly', process: 'readonly' },
    },
  },
  {
    // The website's own script, plain JavaScript that runs in a browser.
    files: ['website/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        SpeechSynthesisUtterance: 'readonly',
      },
    },
  },
);
