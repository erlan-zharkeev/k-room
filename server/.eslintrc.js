
module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'standard-with-typescript'
  ],
  parserOptions: {
    project: [
      './tsconfig.json'
    ],
    files: [
      '*.ts',
      '*.tsx',
      '*.js'
    ],
    ecmaVersion: 8,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  ignorePatterns: ['**/*.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'multiline-ternary': 'off',
    'no-useless-escape': 'off',
    'n/handle-callback-err': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    'array-callback-return': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
  }
}
