export { PASSWORD_SPECIAL_CHARACTERS, VALIDATION_LIMITS, VALIDATION_PATTERNS } from './auth/constants'
export type {
  IAuthLoginPayload,
  IAuthRegistrationPayload,
  ISendConfirmationLinkPayload,
  ISignInWithProviderPayload
} from './auth/types'

export type { CallStatusType, CallFlowType, ICall, IDBCall, DbCallSchemaType } from './calls/types'

export { CHAT_KIND } from './chat/constants'
export type { IChatRoom, ChatRoomsType, IChatRoomSchema, ChatKindType } from './chat/types'

export { EMAIL_CODE_LENGTH } from './codes/constants'
export type {
  ICodes,
  ICodeValidationPayload,
  ISendChangeEmailCodePayload,
  ISendPasswordRecoveryCodePayload,
  IValidateChangeEmailCodePayload
} from './codes/types'

export type { InteractionType, IFrontendContact, FrontendContactMapType } from './contact/types'

export {
  AUTH_ROUTE_NAMES,
  LAYOUT_ROUTE_NAMES,
  PAGE_ROUTE_NAMES,
  ROUTE_NAMES,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  MEDIA_ENDPOINTS,
  CODES_ENDPOINTS,
  ADMIN_ENDPOINTS
} from './endpoints/constants'
export type { RouteNameType, EndpointsType } from './endpoints/types'

export type { IEnvVariables, IEnvSharedVariables } from './env/types'
export { parseEnvContent, readEnv, readSecretEnv } from './env/lib/read-env'
export type { EnvSourceType, IReadEnvOptions, ISecretEnvFileReader } from './env/lib/read-env'

export { APP_LANGUAGE, APP_LANGUAGE_VALUES, APP_LANGUAGE_HEADER, DEFAULT_APP_LANGUAGE } from './language/constants'
export { defineI18n } from './language/lib/define-i18n'
export type { AppLanguageType, LocalizedTextType, LocalizedTextMapType } from './language/types'
export type { I18nValueConstraintType, I18nRecordConstraintType } from './language/lib/types'

export {
  MEDIA_AVATAR_FILENAME_PREFIX,
  MEDIA_BUCKET_NAMES,
  MEDIA_IMAGE_FILENAME_PREFIX,
  MEDIA_KIND_ACCEPT_MAP,
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP,
  MEDIA_MB_IN_BYTES,
  MEDIA_UPLOAD_TYPE_LABEL_MAP,
  MEDIA_VALIDATION_OPTIONS_MAP
} from './media/constants'
export type {
  MediaBucketNameType,
  IMediaValidationOptions,
  MediaKindType,
  MediaUploadType,
  IImageObject,
  MediaFileValueType
} from './media/types'

export type { IPackageData } from './package/types'

export { MESSAGE_STATUS } from './message/constants'
export type {
  MessageStatusType,
  IMessageMetaData,
  IReaction,
  IRepliedMessage,
  IMessage,
  IDBMessage,
  IMessageSchema
} from './message/types'

export type { IChangePasswordPayload, ICreateNewPasswordPayload } from './requests/types'

export type {
  IConfirmEmailResponse,
  LoginResponseType,
  SignInWithProviderResponseType,
  GetUserDataResponseType,
  ISendConfirmationLinkResponse,
  ISendChangeEmailCodeResponse,
  ISendPasswordRecoveryCodeResponse,
  IValidateChangeEmailCodeResponse,
  IValidatePasswordRecoveryCodeResponse
} from './response/types'

export { SENTRY_IGNORED_SUBSTRINGS } from './sentry/constants'
export { isIgnoredSentryStatus, shouldIgnoreSentryError } from './sentry/lib/should-ignore-sentry-error'
export type { ISentryErrorContext } from './sentry/types'

export { PROTECTED_ACTION_REASON, SECURITY_ACTION } from './security/constants'
export type {
  ICaptchaTokenPayload,
  IProtectedActionResponsePayload,
  ProtectedActionReasonType,
  SecurityActionType
} from './security/types'

export { firebaseProviders, providers } from './shared/constants'
export { CONTACT_INTERACTION_UPDATE_FAILED_REASONS } from './socket/constants'
export { formatAppName } from './shared/lib/format-app-name'
export { isUnknownObject } from './shared/lib/type-guards'
export type {
  AuthTokensType,
  FirebaseProviderType,
  ProviderType,
  AvailableCookieType,
  UnknownCallbackType,
  UnknownObjectType,
  IBasicStreamSettings,
  IStreamSettings,
  IBackendMessage,
  IBackendResponse
} from './shared/types'

export type {
  IEventMarkCallAsVideo,
  IEventMessageDelivered,
  IEventGetRoom,
  EventGetRoomsType,
  IEventStatusContact,
  EventChangeContactsDataType,
  EventGetContactsType,
  EventCallUpdatedType,
  EventCallsUpdatedType,
  IEventSaveContact,
  IEventDeleteContact,
  IEventSearchContact,
  IEventGetSearchedContact,
  IEventCreateRoom,
  IEventUpdateChatRoom,
  IEventUserTyping,
  IEventGetContactTypingStatus,
  IEventSendMessage,
  IEventUpdateMessageStatus,
  IEventMessagesStatusUpdated,
  IEventChangeMessageStatus,
  IEventMarkRoomAsRead,
  IEventLoadRoomMessages,
  IEventRoomMessagesLoaded,
  IEventDeleteMessage,
  IEventAddReaction,
  IEventCallUser,
  EventChangeCallSettingsType,
  IEventCallAccepted,
  IEventAnswerCall,
  EventCallStartedAtType,
  IEventCallEnded,
  IEventErrorMessage,
  IEventMessageDeleted,
  IEventUpdatedMessageReactions,
  ICreateRoomAckPayload,
  IEventUpdateInteraction,
  EventInviteReceivedType,
  IEventUpdateContactInteractionSuccess,
  ContactInteractionUpdateFailedReasonType,
  ISocketAckSuccess,
  ISocketAckFailure,
  SocketAckResponseType,
  IEventContactAddSuccess,
  IEventDeleteContactSuccess,
  IEventAuthError,
  IEventUpdateLanguage,
  SocketActionsType
} from './socket/types'

export { REQ_STATUS } from './status/constants'
export type { ReqStatusType } from './status/types'

export { normalizeTimestamp } from './time/lib/normalize-timestamp'
export { formatHumanDateTime } from './time/lib/format-human-date-time'

export { USER_NICKNAME_MAX_LENGTH, USER_NICKNAME_MIN_LENGTH, USER_ROLES } from './user/constants'
export { formatNickname, isNicknameValid, normalizeNickname, normalizeNicknameKey } from './user/lib/nickname'
export type { UserRoleType, IBaseFrontendUserData, IFrontendUserData } from './user/types'

export { VALIDATION_I18N } from './validation/i18n'
export { createValidationMessages } from './validation/messages'
export { NON_EMPTY_PATTERN } from './validation/constants'
export {
  createAuthLoginSchema,
  createAuthRegistrationFormSchema,
  createAuthRegistrationSchema,
  createChangePasswordSchema,
  createConfirmEmailSchema,
  createCreateNewPasswordFormSchema,
  createPasswordSchema,
  createPasswordRecoveryCodeFormSchema,
  createPasswordRecoveryEmailFormSchema,
  createProviderLoginSchema,
  createResetPasswordSchema,
  createSendChangeEmailCodeSchema,
  createSendConfirmationLinkSchema,
  createSendPasswordRecoveryCodeSchema,
  createValidateChangeEmailCodeSchema,
  createUpdateUserDataSchema,
  createValidatePasswordRecoveryCodeSchema
} from './validation/schemas'
export type { ValidationI18nType, ValidationMessagesType } from './validation/types'
