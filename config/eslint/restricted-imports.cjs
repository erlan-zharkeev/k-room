const createDeepImportSelector = (pattern) => `ImportDeclaration[source.value=/^${pattern}\\/[^/]+\\/[^/]+\\//]`

const createRestrictedImportRules = ({
  rootPattern,
  deepImportSelectors,
  deepImportMessage
}) => [
  ...(deepImportSelectors ?? [createDeepImportSelector(rootPattern)]).map((selector) => ({
    selector,
    message: deepImportMessage
  }))
]

module.exports = {
  createRestrictedImportRules
}
