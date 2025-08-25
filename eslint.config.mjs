import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  { ignores: ['node_modules/**', '.next/**', 'out/**', 'dist/**', 'coverage/**'] },

  js.configs.recommended,

  ...compat.config(nextPlugin.configs['core-web-vitals']),

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        ReadonlyURLSearchParams: 'readonly',
        HTMLDivElement: 'readonly',
        process: 'readonly',
        module: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'google-font-display': 'off',
      'google-font-preconnect': 'off',
      ...reactHooksPlugin.configs.recommended.rules,
      'import/order': [
        'error',
        { 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } },
      ],
      'no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
    },
    settings: { react: { version: 'detect' } },
  },

  {
    files: ['next.config.js', 'jest.config.js', 'postcss.config.cjs', '**/*.config.{js,cjs}'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: { 'no-unused-vars': 'warn' },
  },
  {
    files: ['postcss.config.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: { process: 'readonly', console: 'readonly' },
    },
  },

  prettier,
];
