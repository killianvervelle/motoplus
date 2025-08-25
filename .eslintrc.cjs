module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'next/core-web-vitals',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  plugins: ['react', 'react-hooks', 'import'],
  rules: {
    'import/order': ['error', { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
  },
};