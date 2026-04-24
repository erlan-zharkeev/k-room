module.exports = {
  extends: ['plugin:react/recommended', 'plugin:jsx-a11y/recommended', '../config/eslint/base.cjs'],
  env: {
    browser: true
  },
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
    files: ['*.ts', '*.tsx', '*.js']
  },
  plugins: ['react', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': 'off',
    'react/no-unknown-property': 'off'
  }
}
