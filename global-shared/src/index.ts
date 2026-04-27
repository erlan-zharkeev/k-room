export { PASSWORD_SPECIAL_CHARACTERS, VALIDATION_LIMITS, VALIDATION_PATTERNS } from './auth/constants'
export type { IAuthLoginPayload, IAuthRegistrationPayload, ISignInWithProviderPayload } from './auth/types'

export type { CallStatusType, CallFlowType, ICall, IDBCall, IDBCallSchema } from './calls/types'

export type { IChatRoom, ChatRoomsType, IChatRoomSchema } from './chat/types'

export type { ICodes, ICodeValidationPayload } from './codes/types'

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

export type { IEnvVariables, IEnvCommonVariables } from './env/types'

export { INFO_NOTIFICATION_STATUS, WELCOME_INFO_NOTIFICATION_ID } from './info-notification/constants'
export type {
  InfoNotificationStatusType,
  IInfoNotification,
  InfoNotificationMapType,
  IUserInfoNotification,
  IMarkInfoNotificationAsReadPayload
} from './info-notification/types'

export { APP_LANGUAGE, APP_LANGUAGE_VALUES, APP_LANGUAGE_HEADER, DEFAULT_APP_LANGUAGE } from './language/constants'
export { defineI18n } from './language/lib/define-i18n'
export type { AppLanguageType, LocalizedTextType, LocalizedTextMapType } from './language/types'
export type { I18nValueConstraintType, I18nRecordConstraintType } from './language/lib/types'

export type { MediaKindType, IImageObject, MediaFileValueType } from './media/types'

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
  ILoginResponse,
  ISignInWithProviderResponse,
  IGetUserDataResponse,
  ISendConfirmationLinkResponse,
  ISendPasswordRecoveryCodeResponse,
  IValidatePasswordRecoveryCodeResponse
} from './response/types'

export { SENTRY_IGNORED_SUBSTRINGS } from './sentry/constants'
export { isIgnoredSentryStatus, shouldIgnoreSentryError } from './sentry/lib/should-ignore-sentry-error'
export type { ISentryErrorContext } from './sentry/types'

export { firebaseProviders, providers } from './shared/constants'
export { formatAppName } from './shared/lib/format-app-name'
export { isBoolean, isNumber, isString, isUnknownObject } from './shared/lib/type-guards'
export type {
  AuthTokensType,
  FirebaseProviderType,
  ProviderType,
  AvailableCookieType,
  UnknownCallbackType,
  UnknownObject,
  IBasicStreamSettings,
  IStreamSettings,
  IBackendMessage,
  IBackendResponse
} from './shared/types'

export type {
  IEventInterlocutorUpdateSignal,
  IEventUpdateSignal,
  IEventMarkCallAsVideo,
  IEventMessageDelivered,
  EventGetRoomsType,
  IEventStatusContact,
  EventChangeContactsDataType,
  EventGetContactsType,
  EventGetInfoNotificationsType,
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
  IEventChangeMessageStatus,
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
  IEventRoomCreated,
  IEventUpdateInteraction,
  EventInviteReceivedType,
  IEventUpdateContactInteractionSuccess,
  IEventContactAddSuccess,
  IEventDeleteContactSuccess,
  IEventAuthError,
  IEventUpdateLanguage,
  IEventInfoNotificationStatusUpdated,
  EventInfoNotificationReceivedType,
  SocketActionsType
} from './socket/types'

export { REQ_STATUS } from './status/constants'
export type { ReqStatusType } from './status/types'

export { normalizeTimestamp } from './time/lib/normalize-timestamp'
export { formatHumanDateTime } from './time/lib/format-human-date-time'

export { USER_ROLES } from './user/constants'
export type { UserRoleType, IBaseFrontendUserData, IFrontendUserData } from './user/types'

export { VALIDATION_I18N } from './validation/i18n'
export { createValidationMessages } from './validation/messages'
export {
  createAuthLoginSchema,
  createAuthRegistrationFormSchema,
  createAuthRegistrationSchema,
  createChangePasswordSchema,
  createConfirmEmailSchema,
  createCreateNewPasswordFormSchema,
  createPasswordRecoveryCodeFormSchema,
  createPasswordRecoveryEmailFormSchema,
  createProviderLoginSchema,
  createResetPasswordSchema,
  createSendConfirmationLinkSchema,
  createSendPasswordRecoveryCodeSchema,
  createUpdateUserDataSchema,
  createValidatePasswordRecoveryCodeSchema
} from './validation/schemas'
export type { ValidationI18nType, ValidationMessagesType } from './validation/types'
