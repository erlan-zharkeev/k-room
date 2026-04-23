export { VALIDATION_LIMITS, VALIDATION_PATTERNS } from './auth'
export type { IAuthLoginPayload, IAuthRegistrationPayload, ISignInWithProviderPayload } from './auth'

export type { CallStatusType, CallFlowType, ICall, IDBCall, IDBCallSchema } from './calls'

export type { IChatRoom, ChatRoomsType, IChatRoomSchema } from './chat'

export type { ICodes, ICodeValidationPayload } from './codes'

export type { InteractionType, IFrontendContact, FrontendContactMapType } from './contact'

export {
  ROUTE_NAMES,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  MEDIA_ENDPOINTS,
  CODES_ENDPOINTS,
  ADMIN_ENDPOINTS
} from './endpoints'
export type { RouteNameType, EndpointsType } from './endpoints'

export type { IEnvVariables, IEnvCommonVariables } from './env'

export { INFO_NOTIFICATION_STATUS, WELCOME_INFO_NOTIFICATION_ID } from './info-notification'
export type {
  InfoNotificationStatusType,
  IInfoNotification,
  InfoNotificationMapType,
  IUserInfoNotification,
  IMarkInfoNotificationAsReadPayload
} from './info-notification'

export { APP_LANGUAGE, APP_LANGUAGE_VALUES, APP_LANGUAGE_HEADER, DEFAULT_APP_LANGUAGE, defineI18n } from './language'
export type {
  AppLanguageType,
  LocalizedTextType,
  LocalizedTextMapType,
  I18nValueConstraintType,
  I18nRecordConstraintType
} from './language'

export type { MediaKindType, IImageObject, MediaFileValueType } from './media'

export { MESSAGE_STATUS } from './message'
export type {
  MessageStatusType,
  IMessageMetaData,
  IReaction,
  IRepliedMessage,
  IMessage,
  IDBMessage,
  IMessageSchema
} from './message'

export type { ICreateNewPasswordPayload } from './requests'

export type {
  IConfirmEmailResponse,
  ILoginResponse,
  ISignInWithProviderResponse,
  IGetUserDataResponse,
  ISendConfirmationLinkResponse,
  ISendPasswordRecoveryCodeResponse,
  IValidatePasswordRecoveryCodeResponse
} from './response'

export { SENTRY_IGNORED_SUBSTRINGS, isIgnoredSentryStatus, shouldIgnoreSentryError } from './sentry'
export type { ISentryErrorContext } from './sentry'

export { firebaseProviders, providers, formatAppName } from './shared'
export type {
  AuthTokensType,
  FirebaseProviderType,
  ProviderType,
  AvailableCookieType,
  UnknownCallbackType,
  IBasicStreamSettings,
  IStreamSettings,
  IBackendMessage,
  IBackendResponse
} from './shared'

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
} from './socket'

export { REQ_STATUS } from './status'
export type { ReqStatusType } from './status'

export { normalizeTimestamp, formatHumanDateTime } from './time'

export { USER_ROLES } from './user'
export type { UserRoleType, IBaseFrontendUserData, IFrontendUserData } from './user'
