module.exports = {
  env: {
    es2021: true,
    browser: true
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript'],
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
    files: ['*.ts', '*.tsx', '*.js'],
    ecmaVersion: 8,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  ignorePatterns: ['**/*.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',

    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/return-await': 'warn',
    'no-return-await': 'warn',

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
