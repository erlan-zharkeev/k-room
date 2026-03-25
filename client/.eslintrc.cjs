module.exports = {
  extends: ['../config/eslint/base.cjs', 'plugin:react/recommended', 'standard-with-typescript'],
  env: {
    browser: true
  },
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
    files: ['*.ts', '*.tsx', '*.js'],
    ecmaVersion: 8
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',

    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/return-await': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': [
      'warn',
      {
        ignoreConditionalTests: true,
        ignoreMixedLogicalExpressions: true
      }
    ],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': 'off',
    'react/no-unknown-property': 'off',
    'multiline-ternary': 'off',
    'no-useless-escape': 'off',
    'no-case-declarations': 'off',
    'array-callback-return': 'off',
    '@typescript-eslint/no-return-await': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: [
              'src/app/*/*/*/*',
              'src/pages/*/*/*/*',
              'src/widgets/*/*/*/*',
              'src/features/*/*/*/*',
              'src/entities/*/*/*/*',
              'src/shared/*/*/*/*'
            ],
            message: 'Avoid deep absolute imports. Use the module public API (`index.ts`) where it exists.'
          }
        ]
      }
    ],
    'import/no-cycle': ['error', { maxDepth: Infinity }],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        pathGroups: [
          // React выше всех
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: 'react-dom', group: 'external', position: 'before' },

          // Слои FSD в порядке сверху вниз:
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
    ]
  }
}
