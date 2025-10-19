import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

export default [
  pluginJs.configs.recommended,
  stylistic.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'eslint.config.js',
    ],

    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: { console: 'readonly' },
    },

    rules: {
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
    },
  },
]
