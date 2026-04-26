export { clearCookie, getCookie } from './cookie'
export { log } from './log'
export { formatLocalizedDate, formatLocalizedRelativeTime, formatLocalizedTime, getNextReqInterval } from './time'
export { getViewPort } from './browser/get-view-port'
export { imageToBase64 } from './browser/image-to-base64'
export { createClassNameWithModifiers } from './create-class-name-with-modifiers/create-class-name-with-modifiers'
export { stopPropagation } from './event-modifiers/event-modifiers'
export { firstCharUpperCase } from './helpers/first-char-upper-case'
export {
  maxLengthRule,
  minLengthRule,
  passwordMinLengthRule,
  patternRule,
  requiredAgreementRule,
  requiredEmailRule,
  requiredPasswordRule,
  requiredStringRule,
  requiredTrueRule,
  strongPasswordRule,
  usernameMaxLengthRule,
  usernameMinLengthRule,
  validEmailRule
} from './form-validation/rules'
export { useFormValidation } from './form-validation/use-form-validation'
export { usePrimeVueFormResolver } from './form-validation/prime-vue-form-resolver'
export type {
  FormErrorsType,
  FormFieldNameType,
  FormRulesType,
  FormTouchedType,
  FormValidationRuleType
} from './form-validation/types'
export { generateUUIDv4 } from './helpers/generate-uuid-v4'
export { getLastIdx } from './helpers/get-last-idx'
export { getRandomNumber } from './helpers/get-random-number'
export { useI18n } from './i18n/use-i18n'
export { currentLanguage, setClientLanguage, translate } from './i18n/language'
export { buildPathWithParams } from './url/build-path-with-params'
export { getCustomThemeColor } from './theme/get-custom-theme-color'
export { getSystemTheme, isSystemThemeLight } from './theme/get-system-theme'
export { isThemeType } from './theme/is-theme-type'
export { applyThemePreset, defaultThemePreset, getThemePreset } from './theme/theme-preset'
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
