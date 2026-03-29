const { createRestrictedImportRules, createRestrictedPathRules } = require('../config/eslint/restricted-imports.cjs')

module.exports = {
  extends: ['../config/eslint/base.cjs', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    node: true
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    files: ['*.ts', '*.js'],
    ecmaVersion: 8
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  rules: {
    'no-restricted-syntax': [
      'error',
      ...createRestrictedPathRules({
        pathPattern: '\\.',
        message: 'Bare `.` imports/exports are not allowed. Use `./index` or an explicit local file path.'
      }),
      ...createRestrictedPathRules({
        pathPattern: '\\.\\.(?:\\/.*)?',
        message: 'Parent relative paths are not allowed. Relative paths must start with `./`; use a public alias path instead of `../...`.'
      }),
      ...createRestrictedImportRules({
        rootPattern: 'src\\/(app|features|entities|shared)',
        deepImportMessage: 'Use the shortest public API import. Imports deeper than `<layer>/<module>` are not allowed.'
      })
    ],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^node:'],
          ['^@?\\w'],
          ['^common$'],
          ['^src/app/'],
          ['^src/features/'],
          ['^src/entities/'],
          ['^src/shared/'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
        ]
      }
    ],
    'simple-import-sort/exports': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'no-duplicate-imports': 'off',
    'no-control-regex': 'off',
    'no-extra-semi': 'off',
    semi: ['error', 'never']
  },
  overrides: [
    {
      files: ['**/*.spec.ts', '**/*.test.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}
