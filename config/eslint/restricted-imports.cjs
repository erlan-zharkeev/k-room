const createDeepImportSelector = (pattern) =>
  `ImportDeclaration[source.value=/^${pattern}\\/[^/]+\\/[^/]+/][source.value!=/\\.scss$/]`

const createSourceSelector = (nodeType, pattern) => `${nodeType}[source.value=/^${pattern}$/]`

const BARE_DOT_IMPORT_MESSAGE =
  'Bare `.` imports/exports are not allowed. Use `./index` or an explicit local file path.'

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

const createCommonRelativePathRules = () => [
  ...createRestrictedPathRules({
    pathPattern: '\\.',
    message: BARE_DOT_IMPORT_MESSAGE
  })
]

module.exports = {
  BARE_DOT_IMPORT_MESSAGE,
  createCommonRelativePathRules,
  createRestrictedImportRules,
  createRestrictedPathRules
}
