
module.exports = {
  env: {
    es2021: true,
    browser: true
  },
  extends: [
    'plugin:react/recommended',
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
    'react',
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'react/react-in-jsx-scope': 'off',
    'multiline-ternary': 'off',
    'no-useless-escape': 'off',
    'react/jsx-key': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
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
