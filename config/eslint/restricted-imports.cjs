const RELATIVE_IMPORT_SELECTOR = "ImportDeclaration[source.value=/^\\.\\.?\\//][source.value!='./style.scss']"

const createDeepImportSelector = (pattern) =>
  `ImportDeclaration[source.value=/^${pattern}\\/[^/]+\\/[^/]+\\//]`

const createRestrictedImportRules = ({
  rootPattern,
  relativeImportMessage = 'Use alias imports. Relative imports are allowed only for `./style.scss`.',
  deepImportMessage
}) => [
  {
    selector: RELATIVE_IMPORT_SELECTOR,
    message: relativeImportMessage
  },
  {
    selector: createDeepImportSelector(rootPattern),
    message: deepImportMessage
  }
]

module.exports = {
  createRestrictedImportRules
}
