module.exports = {
  extends: ['../config/eslint/base.cjs'],
  env: {
    node: true
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  }
}
