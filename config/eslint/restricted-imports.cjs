const RELATIVE_IMPORT_SELECTOR = "ImportDeclaration[source.value=/^\\.\\.?\\//][source.value!='./style.scss']"

const createDeepImportSelector = (pattern) => `ImportDeclaration[source.value=/^${pattern}\\/[^/]+\\/[^/]+\\//]`

const createRestrictedImportRules = ({
  rootPattern,
  deepImportSelectors,
  allowRelativeImports = true,
  relativeImportMessage,
  deepImportMessage
}) => [
  ...(allowRelativeImports
    ? []
    : [
        {
          selector: RELATIVE_IMPORT_SELECTOR,
          message: relativeImportMessage
        }
      ]),
  ...(deepImportSelectors ?? [createDeepImportSelector(rootPattern)]).map((selector) => ({
    selector,
    message: deepImportMessage
  }))
]

module.exports = {
  createRestrictedImportRules
}
