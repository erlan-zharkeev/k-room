module.exports = {
  extends: ['../.eslintrc.base.cjs', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
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
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^node:'],
          ['^@?\\w'],
          ['^common-types$'],
          ['^app/'],
          ['^features/'],
          ['^entities/'],
          ['^shared-config$', '^shared-lib$', '^shared-middleware$'],
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
