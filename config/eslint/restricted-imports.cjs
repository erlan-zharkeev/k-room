const createDeepImportSelector = (pattern) => `ImportDeclaration[source.value=/^${pattern}\\/[^/]+\\/[^/]+\\//]`

const createSourceSelector = (nodeType, pattern) => `${nodeType}[source.value=/^${pattern}$/]`

const BARE_DOT_IMPORT_MESSAGE = 'Bare `.` imports/exports are not allowed. Use `./index` or an explicit local file path.'
const PARENT_RELATIVE_IMPORT_MESSAGE =
  'Parent relative paths are not allowed. Relative paths must start with `./`; use a public alias path instead of `../...`.'

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
  }),
  ...createRestrictedPathRules({
    pathPattern: '\\.\\.(?:\\/.*)?',
    message: PARENT_RELATIVE_IMPORT_MESSAGE
  })
]

module.exports = {
  BARE_DOT_IMPORT_MESSAGE,
  PARENT_RELATIVE_IMPORT_MESSAGE,
  createCommonRelativePathRules,
  createRestrictedImportRules,
  createRestrictedPathRules
}
