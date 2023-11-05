module.exports = {
  env: {
    es2021: true,
    browser: true
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript'],
  parserOptions: {
    project: ['./tsconfig.json'],
    files: ['*.ts', '*.tsx', '*.js'],
    ecmaVersion: 8,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  ignorePatterns: ['**/*.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': 'off',
    'react/no-unknown-property': 'off',
    'multiline-ternary': 'off',
    'no-useless-escape': 'off',
    'circular-dependecy-issue': 'off',
    'no-case-declarations': 'off',
    'array-callback-return': 'off'
  },
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      fragment: 'Fragment',
      version: 'detect',
      flowVersion: '0.53'
    },
    propWrapperFunctions: [
      'forbidExtraProps',
      {
        property: 'freeze',
        object: 'Object'
      },
      {
        property: 'myFavoriteWrapper'
      },
      {
        property: 'forbidExtraProps',
        exact: true
      }
    ],
    componentWrapperFunctions: [
      'observer',
      {
        property: 'styled'
      },
      {
        property: 'observer',
        object: 'Mobx'
      },
      {
        property: 'observer',
        object: '<pragma>'
      }
    ],
    formComponents: [
      'CustomForm',
      {
        name: 'Form',
        formAttribute: 'endpoint'
      }
    ],
    linkComponents: [
      'Hyperlink',
      {
        name: 'Link',
        linkAttribute: 'to'
      }
    ]
  }
}
