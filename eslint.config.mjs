import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'out/**',
      '.yarn/**',
      'coverage/**',
      'playwright-report/**',
      '.vercel/**',
      '.turbo/**',
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{jsx,ts,js,tsx}"],
    languageOptions: {
    parser: tseslint.parser,
    parserOptions: { projectService: true } 
  },
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-explicit-any": "off"
    },
    settings: { react: { version: "detect" } }
  },

  {
    files: ["*.config.js", "*.config.cjs"],
    languageOptions: {
      globals: {
        module: "readonly",
        process: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
  }
);