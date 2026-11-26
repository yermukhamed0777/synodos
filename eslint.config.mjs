import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/** Flat ESLint config. Warnings are denied via `--max-warnings 0` in package.json. */
export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'out-*/**',
      'desktop/node_modules/**',
      'desktop/dist/**',
      'next-env.d.ts',
      '**/*.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  // Build scripts and tests run in Node, not a browser.
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.ts'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly', URL: 'readonly', Buffer: 'readonly' },
    },
  },
  // The Electron entry point is CommonJS and runs in Node, not a browser.
  {
    files: ['desktop/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', process: 'readonly', __dirname: 'readonly', module: 'readonly' },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
);
