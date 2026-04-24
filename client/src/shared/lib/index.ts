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
  validEmailRule,
  useFormValidation
} from './form-validation'
export type {
  FormErrorsType,
  FormFieldNameType,
  FormRulesType,
  FormTouchedType,
  FormValidationRuleType
} from './form-validation'
export { generateUUIDv4 } from './helpers/generate-uuid-v4'
export { getLastIdx } from './helpers/get-last-idx'
export { getRandomNumber } from './helpers/get-random-number'
export { useI18n } from './i18n/use-i18n'
export { buildPathWithParams } from './url/build-path-with-params'
export { db, KRoomDB, dexieCollectionStore, dexieKeyValueStore, useDexieLiveQuery } from './db'
export type {
  DbTransactionModeType,
  ICollectionMergeManyOptions,
  IndexableType,
  IUseStateResult,
  KvItem,
  MutableType,
  UseResult
} from './db'
