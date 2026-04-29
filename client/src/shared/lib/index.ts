export { clearCookie, getCookie } from './cookie'
export { log } from './log'
export {
  formatLocalizedDate,
  formatLocalizedRelativeTime,
  formatLocalizedTime,
  getNextRequestIntervalSeconds
} from './time'
export { getViewPort } from './browser/get-view-port'
export { imageToBase64 } from './browser/image-to-base64'
export { useScreen } from './browser/use-screen'
export { createClassNameWithModifiers } from './create-class-name-with-modifiers/create-class-name-with-modifiers'
export { stopPropagation } from './event-modifiers/event-modifiers'
export { isFormFieldInvalid } from './form/is-form-field-invalid'
export { firstCharUpperCase } from './helpers/first-char-upper-case'
export { generateUUIDv4 } from './helpers/generate-uuid-v4'
export { getLastIdx } from './helpers/get-last-idx'
export { getRandomNumber } from './helpers/get-random-number'
export { useI18n } from './i18n/use-i18n'
export { currentLanguage, setClientLanguage, translate } from './i18n/language'
export { buildPathWithParams } from './url/build-path-with-params'
export { getCustomThemeColor } from './theme/get-custom-theme-color'
export { isThemeType } from './theme/is-theme-type'
export { createThemePreset } from './theme/create-theme-preset'
export { mergeCustomTheme } from './theme/merge-custom-theme'
export { db, KRoomDB } from './db/db'
export { dexieCollectionStore } from './db/dexie-collection-store'
export { dexieKeyValueStore } from './db/dexie-key-value-store'
export { useDexieLiveQuery } from './db/use-dexie-live-query'
export type {
  DbTransactionModeType,
  ICollectionMergeManyOptions,
  IndexableType,
  IUseStateResult,
  KvItem,
  MutableType,
  UseResult
} from './db/types'
