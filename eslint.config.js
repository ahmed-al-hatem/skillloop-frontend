import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Architecture rules (see docs/02-project-structure.md).
// src/features/ = member app, src/admin-features/ = admin area. Same rules for both.
const noDeepFeatureImports = {
  regex: '^@/features/[^/]+/.+',
  message: "Import another feature only through its index.ts, e.g. '@/features/profile'.",
};
const noDeepAdminFeatureImports = {
  regex: '^@/admin-features/[^/]+/.+',
  message:
    "Import another admin feature only through its index.ts, e.g. '@/admin-features/members'.",
};
// src/mocks/handlers.ts may reach into <feature>/mocks/ only, so mock data never
// ends up in the production bundle through a feature's index.ts.
const noDeepFeatureImportsExceptMocks = {
  regex: '^@/features/[^/]+/(?!mocks/).+',
  message: 'src/mocks may only import from @/features/<feature>/mocks/*.',
};
const noDeepAdminFeatureImportsExceptMocks = {
  regex: '^@/admin-features/[^/]+/(?!mocks/).+',
  message: 'src/mocks may only import from @/admin-features/<feature>/mocks/*.',
};
const noFeaturesInShared = {
  regex: '(^@/|/)features(/|$)',
  message: 'src/shared must never import from src/features.',
};
const noAdminFeaturesInShared = {
  regex: '(^@/|/)admin-features(/|$)',
  message: 'src/shared must never import from src/admin-features.',
};
const noAdminFeaturesInMemberFeatures = {
  regex: '^@/admin-features(/|$)',
  message: 'Member features must not depend on the admin area.',
};
// Relative imports are for files inside one feature. Reaching a sibling feature
// with '../../<other>/...' would skip its index.ts.
const noRelativeFeatureEscape = {
  group: ['../../*/**'],
  message:
    "Import a sibling feature through its index.ts ('@/features/<f>' or '@/admin-features/<f>'), not with a relative path.",
};
const noMockImports = {
  regex: '/mocks/',
  message:
    'Never import mock data into components, pages, hooks or api. Fake data goes through MSW handlers.',
};

const restrictImports = (...patterns) => ({ 'no-restricted-imports': ['error', { patterns }] });

// Flat config does not merge rule options: a later block replaces the patterns of an
// earlier one, so every block lists its full set.
const base = [noDeepFeatureImports, noDeepAdminFeatureImports];
const memberFeature = [...base, noAdminFeaturesInMemberFeatures, noRelativeFeatureEscape];
const adminFeature = [...base, noRelativeFeatureEscape];
const appCodeFolders = '{components,pages,hooks,api}';

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
    rules: restrictImports(...base),
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: restrictImports(...base, noFeaturesInShared, noAdminFeaturesInShared),
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: restrictImports(...memberFeature),
  },
  {
    files: [`src/features/*/${appCodeFolders}/**/*.{ts,tsx}`],
    rules: restrictImports(...memberFeature, noMockImports),
  },
  {
    // The admin area may use member features (e.g. '@/features/auth') through index.ts only.
    files: ['src/admin-features/**/*.{ts,tsx}'],
    rules: restrictImports(...adminFeature),
  },
  {
    files: [`src/admin-features/*/${appCodeFolders}/**/*.{ts,tsx}`],
    rules: restrictImports(...adminFeature, noMockImports),
  },
  {
    files: ['src/mocks/**/*.ts'],
    rules: restrictImports(noDeepFeatureImportsExceptMocks, noDeepAdminFeatureImportsExceptMocks),
  },
  {
    // Route lists and providers export non-components on purpose.
    files: ['src/**/routes.tsx', 'src/app/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  // Must stay last: turns off rules that conflict with Prettier.
  prettier,
]);
