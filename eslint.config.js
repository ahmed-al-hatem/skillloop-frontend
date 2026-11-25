import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Architecture rules (see docs/02-project-structure.md).
const noDeepFeatureImports = {
  regex: '^@/features/[^/]+/.+',
  message: "Import another feature only through its index.ts, e.g. '@/features/profile'.",
};
// src/mocks/handlers.ts may reach into features/<f>/mocks/ only, so mock data never
// ends up in the production bundle through a feature's index.ts.
const noDeepFeatureImportsExceptMocks = {
  regex: '^@/features/[^/]+/(?!mocks/).+',
  message: 'src/mocks may only import from @/features/<feature>/mocks/*.',
};
const noFeaturesInShared = {
  regex: '(^@/|/)features(/|$)',
  message: 'src/shared must never import from src/features.',
};

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'public/mockServiceWorker.js']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': ['error', { patterns: [noDeepFeatureImports] }],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [noDeepFeatureImports, noFeaturesInShared] }],
    },
  },
  {
    files: ['src/mocks/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [noDeepFeatureImportsExceptMocks] }],
    },
  },
  {
    // Route lists and providers export non-components on purpose.
    files: ['src/**/routes.tsx', 'src/app/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  // Must stay last: turns off rules that conflict with Prettier.
  prettier,
]);
