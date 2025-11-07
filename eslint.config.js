import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from "globals";

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'eslint.config.js',
    ],
  },

  pluginJs.configs.recommended,
  stylistic.configs.recommended,

  {
    files: ['src/**/*.{js,ts,tsx}'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        console: 'readonly',
      },
    },
    rules: {
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/eol-last': ['error', 'always'],
    },
  },
]