module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-clean-order', 'stylelint-config-prettier-scss'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    }
  ],
  rules: {
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep']
      }
    ],
    'no-descending-specificity': null,
    'max-nesting-depth': 2,
    'selector-nested-pattern': [
      '^(?!.*&(?:__|--)).*$',
      {
        message:
          'Do not use BEM element or modifier nesting through `&__` or `&--`. Write full class selectors explicitly.'
      }
    ]
  }
}
