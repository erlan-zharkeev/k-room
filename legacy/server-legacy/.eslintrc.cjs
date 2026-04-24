module.exports = {
  extends: ['../config/eslint/server.cjs'],
  env: {
    node: true
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  }
}
