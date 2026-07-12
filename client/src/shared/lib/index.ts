export {
  formatLocalizedDate,
  formatLocalizedDateTime,
  formatLocalizedRelativeTime,
  formatLocalizedTime,
  getNextRequestIntervalSec
} from './time/time'
export { useCounter } from './time/use-counter'
export { useRequestCooldownCounter } from './time/use-request-cooldown-counter'
export {
  DATE_PATTERN_BY_DATE_TIME_FORMAT,
  DEFAULT_DATE_TIME_FORMAT,
  TIME_PATTERN_BY_DATE_TIME_FORMAT
} from './time/constants'
export {
  canShowBrowserPush,
  canvasToBlob,
  clearCookie,
  formatBytes,
  getClientPlatform,
  getDataUrlMimeType,
  getViewPort,
  imageToBase64,
  isBrowserPushSupported,
  isEmptyFileWithName,
  isInstalledPwa,
  loadImageFromObjectUrl,
  log,
  readFileAsDataUrl,
  resolveFileExtension,
  revokeObjectUrl,
  revokeObjectUrls,
  showBrowserPush,
  waitNextFrame,
  useScreen
} from './browser/browser'
export { useMediaDevicePermission, useTouchInput } from './browser/browser.model'
export { syncAppBadge } from './browser/app-badge'
export { isClientPushEnabled, showClientPushWithImage } from './browser/client-push'
export { IMAGE_RESOLUTIONS } from './browser/constants'
export {
  APP_BADGE_SERVICE_WORKER_SYNC_MESSAGE_TYPE,
  NOTIFICATION_FOREGROUND_SERVICE_WORKER_SYNC_MESSAGE_TYPE
} from './browser/service-worker-message.constants'
export { createClassNameWithModifiers, stopPropagation } from './dom/dom'
export {
  buildPathWithParams,
  firstCharUpperCase,
  getRandomNumber,
  isFormFieldInvalid,
  getNmorphGeneratedColorSchema
} from './misc/misc'
export {
  buildMediaDeviceSelectOptions,
  resolveMediaDeviceSelectOptionValue,
  resolveMediaDeviceSelectValue,
  resolveSelectedDeviceId,
  resolveSelectedDeviceIdOnDeviceChange,
  syncSelectedDeviceId,
  syncSelectedDeviceIdOnDeviceChange
} from './media/device-selection'
export { DEFAULT_MEDIA_DEVICE_SELECT_VALUE } from './media/constants'
export { acquireUrl, releaseUrl, useLiveMediaUrl, useLiveMediaUrlMap, useLiveMediaUrls } from './media/media'
export { loadStorageEstimate, useStorageEstimate } from './storage/storage.model'
export { setI18nRuntime, useI18n } from './i18n/i18n'
export { buildI18nMessages, defineI18n, i18nFormatter } from './i18n/define-i18n'
export {
  createDifferentOrEmptyValidationPattern,
  createExactOrEmptyValidationPattern,
  createPasswordValidationRules
} from './validation/validation'
export { CLIENT_LANGUAGE } from './i18n/constants'
export {
  dexieCollectionStore,
  dexieKeyValueStore,
  initializeDexieCollectionStores,
  openDexieDatabase,
  subscribeDexieLiveQuery,
  useDexieLiveQuery
} from './db/db.model'
export { DEXIE_CACHE_TRIMMER_PRIORITIES } from './db/constants'
export { registerDexieCacheTrimmer, subscribeDexieCacheTrimEvents } from './db/cache-trim'
export { db, KRoomDB } from './db/db'
export { useAppToast } from './toast/toast'
export { TOAST_LIFE_MS, TOAST_PLACEMENT } from './toast/constants'
export { TOAST_I18N } from './toast/i18n'
export { captureClientSentryException, captureClientSentryMessage, withClientSentryScope } from './sentry/sentry'
export { DB_QUOTA_I18N } from './db/i18n'
export { BROWSER_I18N } from './browser/i18n'
export { MEDIA_DEVICE_I18N } from './media/i18n'
export { useMediaDeviceSelectOptions } from './media/use-media-device-select-options.model'
export { calculateAudioVolumeDb, createAudioMeterAnalyser } from './audio/audio-meter'
export {
  APP_SOUND_KIND_VALUES,
  APP_SOUND_SRC_BY_KIND,
  AUDIO_METER_ANALYSER_FFT_SIZE,
  AUDIO_METER_SMOOTHING_TIME_CONSTANT
} from './audio/constants'
export { buildNextEmojiPickerQuickList } from './emoji/emoji'
export type { AppSoundKind, AudioMeterAnalyser } from './audio/types'
export type {
  ClientPlatform,
  ClientPushMediaGetter,
  ClientPushNotificationGroupSettings,
  FileLoaderValue
} from './browser/types'
export type { AppBadgeNavigator, AppBadgeServiceWorkerSyncMessage } from './browser/app-badge.types'
export type { ContextRef, KebabCase } from './misc/types'
export type { I18nKey } from './i18n/define-i18n'
export type { I18nTranslate } from './i18n/i18n.types'
export type { MediaDeviceSelectModelValue, MediaDeviceSelectOption } from './media/types'
export type { DateTimeFormatPatternMap, DateTimeFormat } from './time/types'
export type { FormField, FormPatternRule, FormRequiredPatternRule, FormRule } from './validation/types'
export type { AppToastStack, AppToastInput } from './toast/types'
export type {
  ContactLocalState,
  ContactRecord,
  MediaRecordStatus,
  DexieCacheTrimEvent,
  CollectionMergeManyOptions,
  DexieCacheTrimResult,
  DexieCacheTrimmer,
  MediaRecord,
  UseStateResult,
  KnownUserLocalState,
  KnownUserRecord,
  KvItem,
  Mutable,
  UseResult
} from './db/types'
