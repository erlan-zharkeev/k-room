const { createCommonRelativePathRules, createRestrictedImportRules } = require('./restricted-imports.cjs')
const { createBoundariesConfig } = require('./boundaries.cjs')

const { elements, rules: boundariesRules } = createBoundariesConfig([
  { type: 'app', pattern: 'src/app/**' },
  { type: 'pages', pattern: 'src/pages/**' },
  { type: 'widgets', pattern: 'src/widgets/**' },
  { type: 'features', pattern: 'src/features/**' },
  { type: 'entities', pattern: 'src/entities/**' },
  { type: 'shared', pattern: 'src/shared/**' }
])

module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    files: ['*.ts', '*.js']
  },
  ignorePatterns: ['**/*.js'],
  plugins: ['@typescript-eslint', 'import', 'boundaries'],
  settings: {
    'boundaries/elements': elements,
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-return-await': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/promise-function-async': 'off',

    'no-restricted-syntax': [
      'warn',
      ...createCommonRelativePathRules(),
      ...createRestrictedImportRules({
        rootPattern: 'src\\/(app|pages|widgets|features|entities|shared)',
        deepImportMessage:
          'Use the shortest public API import. Imports deeper than `src/<layer>/<module>` are not allowed.'
      })
    ],
    'boundaries/dependencies': ['error', { default: 'disallow', rules: boundariesRules }],

    'import/no-cycle': ['error', { maxDepth: Infinity }],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        pathGroups: [
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: 'react-dom', group: 'external', position: 'before' },
          { pattern: 'common', group: 'external', position: 'after' },
          { pattern: 'src/app/**', group: 'internal', position: 'after' },
          { pattern: 'src/pages/**', group: 'internal', position: 'after' },
          { pattern: 'src/widgets/**', group: 'internal', position: 'after' },
          { pattern: 'src/features/**', group: 'internal', position: 'after' },
          { pattern: 'src/entities/**', group: 'internal', position: 'after' },
          { pattern: 'src/shared/**', group: 'internal', position: 'after' }
        ],
        pathGroupsExcludedImportTypes: ['react'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        'newlines-between': 'always'
      }
    ],

    'multiline-ternary': 'off',
    'no-useless-escape': 'off',
    'no-case-declarations': 'off',
    'array-callback-return': 'off',
    'no-duplicate-imports': 'off',
    'no-extra-semi': 'off',
    'sort-imports': 'off'
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
