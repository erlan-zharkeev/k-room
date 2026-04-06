const createDeepImportSelector = (pattern) =>
  `ImportDeclaration[source.value=/^${pattern}\\/[^/]+\\/[^/]+/][source.value!=/\\.scss$/]`

const createSourceSelector = (nodeType, pattern) => `${nodeType}[source.value=/^${pattern}$/]`

const createRestrictedImportRules = ({ rootPattern, deepImportSelectors, deepImportMessage }) => [
  ...(deepImportSelectors ?? [createDeepImportSelector(rootPattern)]).map((selector) => ({
    selector,
    message: deepImportMessage
  }))
]

const createRestrictedPathRules = ({ pathPattern, message }) =>
  ['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].map((nodeType) => ({
    selector: createSourceSelector(nodeType, pathPattern),
    message
  }))

module.exports = {
  createRestrictedImportRules,
  createRestrictedPathRules
}
