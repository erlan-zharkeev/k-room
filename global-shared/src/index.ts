export { PASSWORD_SPECIAL_CHARACTERS, VALIDATION_LIMITS, VALIDATION_PATTERNS } from './auth/constants'
export type {
  AuthLoginPayload,
  AuthRegistrationPayload,
  SendConfirmationLinkPayload,
  SignInWithProviderPayload
} from './auth/types'

export type {
  RoomCallStatus,
  RoomCallMediaKind,
  RoomCallSignalKind,
  RoomCallQuickCommand,
  RoomCallTemporaryQuickCommand,
  RoomCallLeaveReason,
  RoomCallAckFailureReason,
  RoomCallIceServer,
  RoomCallRtcConfiguration,
  RoomCallParticipantMediaState,
  RoomCallParticipantQuickCommandState,
  RoomCallParticipantQuickCommandStateByUserId,
  RoomCallParticipant,
  RoomCall,
  EventRoomCallsUpdated,
  EventLoadRoomCalls,
  EventRoomCallsLoaded,
  EventStartRoomCall,
  StartRoomCallAckPayload,
  EventJoinRoomCall,
  JoinRoomCallAckPayload,
  EventDeclineRoomCall,
  EventMarkRoomCallsAsSeen,
  EventLeaveRoomCall,
  EventUpdateRoomCallMediaState,
  EventSendRoomCallSignal,
  EventSendRoomCallQuickCommand,
  EventSetRoomCallHandRaised,
  EventRoomCallStarted,
  EventRoomCallJoined,
  EventRoomCallDeclined,
  EventRoomCallLeft,
  EventRoomCallEnded,
  EventRoomCallMediaStateUpdated,
  EventRoomCallQuickCommandReceived,
  EventRoomCallHandRaisedUpdated,
  EventRoomCallSignalReceived
} from './room-calls/types'
export {
  ROOM_CALL_ACTUALIZATION_LIMIT,
  ROOM_CALL_DEFAULT_PARTICIPANT_QUICK_COMMAND_STATE,
  ROOM_CALL_LOAD_LIMIT_MAX,
  ROOM_CALL_MEDIA_KIND_VALUES,
  ROOM_CALL_STUN_URLS,
  ROOM_CALL_STATUS_VALUES
} from './room-calls/constants'

export {
  CHAT_KIND_VALUES,
  CHAT_ROOM_NAME_MAX_LENGTH,
  PINNED_CHAT_ROOM_LIMIT,
  SUPPORT_CHAT_STATUS_VALUES,
  USER_CHAT_ROOM_LIMIT
} from './chat/constants'
export {
  getRoomInterlocutorId,
  getRoomOtherUserIds,
  isRoomAdmin,
  isRoomFavorites,
  isRoomGroup,
  isRoomPrivate,
  isRoomSupport,
  isRoomVisibleForUser
} from './chat/lib'
export type {
  ChatRoom,
  ChatRooms,
  ChatKind,
  SupportChatStatus,
  EventGetRoom,
  EventGetRooms,
  EventCreateRoom,
  EventCloseSupportChat,
  EventUpdateChatRoom,
  EventDeleteChatRoom,
  EventChatRoomDeleted,
  EventLeaveChatRoom,
  EventChatRoomLeft,
  EventUpdatePinnedChatRoom,
  EventUpdatePinnedChatRoomOrder,
  EventPinnedChatRoomsUpdated,
  EventUpdateMutedChatRoom,
  EventMutedChatRoomsUpdated,
  EventUserTyping,
  EventRoomTypingStatus,
  EventMarkRoomAsRead,
  CreateRoomAckPayload
} from './chat/types'

export { EMAIL_CODE_LENGTH } from './codes/constants'
export type { EmailCodeRequestPayload, EmailCodeValidationPayload } from './codes/types'

export type {
  Interaction,
  Contact,
  KnownUser,
  ContactMap,
  EventStatusContact,
  EventGetContacts,
  EventKnownUsersUpdated,
  EventSaveContact,
  EventDeleteContact,
  EventSearchContact,
  EventGetSearchedContact,
  EventGetContactTypingStatus,
  EventUpdateInteraction,
  EventUpdateContactInteractionSuccess,
  EventContactAddSuccess,
  EventDeleteContactSuccess
} from './contact/types'
export { CONTACT_LIMIT, CONTACT_SEARCH_QUERY_MAX_LENGTH, CONTACT_SEARCH_RESULT_LIMIT } from './contact/constants'
export {
  isAcceptedContactInteraction,
  isBlockedContactInteraction,
  isDefaultContactInteraction,
  isInvitedContactInteraction,
  isInviteReceivedContactInteraction,
  isPendingContactInteraction
} from './contact/lib'

export {
  APP_ROUTE_NAMES,
  APP_ROUTE_PATHS,
  AUTH_ROUTE_NAMES,
  LAYOUT_ROUTE_NAMES,
  PAGE_ROUTE_NAMES,
  ROOT_ROUTE_NAMES,
  ROUTE_NAMES,
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  MEDIA_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  CODES_ENDPOINTS,
  CLIENT_RUNTIME_ENDPOINTS,
  MONITORING_ENDPOINTS,
  ADMIN_ENDPOINTS
} from './endpoints/constants'
export { getAppCallPath, getAppChatRoomPath, getAppContactPath, getAppSettingsPath } from './endpoints/lib'
export type { AppRoutePath, RouteName, Endpoints } from './endpoints/types'

export { CLIENT_RUNTIME_POLICY_ACTIONS } from './client-runtime/constants'
export type { ClientRuntimePolicyAction, ClientRuntimePolicyResponse } from './client-runtime/types'

export type {
  EnvKey,
  EnvSource,
  EnvVariables,
  EnvSharedVariables,
  ReadEnvOptions,
  SecretEnvFileReader
} from './env/types'
export { parseEnvContent, readEnv, readSecretEnv } from './env/lib'

export { APP_LANGUAGE_VALUES, APP_LANGUAGE_HEADER, DEFAULT_APP_LANGUAGE } from './language/constants'
export { defineI18n, formatPlural } from './language/lib'
export type { AppLanguage, EventUpdateLanguage, LocalizedText, LocalizedTextMap, PluralForms } from './language/types'
export type { I18nValueConstraint, I18nRecordConstraint } from './language/lib'

export {
  MEDIA_KIND_HEADER_NAME,
  MEDIA_AUDIO_UPLOAD_EXTENSIONS,
  MEDIA_AVATAR_VALIDATION_OPTIONS,
  MEDIA_BUCKET_SUPPORTED_KIND_MAP,
  MEDIA_BUCKET_NAMES,
  MEDIA_DOCUMENT_UPLOAD_EXTENSIONS,
  MEDIA_KIND_ACCEPT_MAP,
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP,
  MEDIA_UPLOAD_TYPE_LABEL_MAP,
  MEDIA_VALIDATION_OPTIONS_MAP,
  MEDIA_VIDEO_UPLOAD_EXTENSIONS
} from './media/constants'
export type {
  MediaBucketName,
  MediaId,
  MediaAudioUploadExtension,
  MediaDocumentUploadExtension,
  MediaValidationOptions,
  MediaKind,
  MediaUpload,
  MediaVideoUploadExtension,
  MediaObject,
  AudioObject,
  DocumentObject,
  ImageObject,
  VideoObject,
  EventMediaFilesDeleted
} from './media/types'

export type { PackageData } from './package/types'

export type {
  DeleteWebPushSubscriptionPayload,
  EventUpdateNotificationForeground,
  WebPushConfigResponse,
  WebPushNotificationGroup,
  WebPushNotificationPayload,
  WebPushSubscriptionEnabledGroups,
  WebPushSubscriptionKeysPayload,
  WebPushSubscriptionPayload
} from './notification/types'

export {
  MESSAGE_ATTACHMENT_LIMIT,
  MESSAGE_BODY_MAX_LENGTH,
  MESSAGE_LINK_CANDIDATE_PATTERN,
  MESSAGE_LINK_PROTOCOL,
  MESSAGE_LINK_TRAILING_PUNCTUATION_PATTERN,
  MESSAGE_LOAD_LIMIT_MAX,
  MESSAGE_REACTION_LIMIT_PER_USER,
  MESSAGE_STATUS_VALUES
} from './message/constants'
export {
  buildPendingMessageLinkPreview,
  isMessageAuthor,
  isMessageReadStatus,
  isMessageSendingStatus,
  isMessageStatusDelivered
} from './message/lib'
export type {
  MessageStatus,
  MessageLoadDirection,
  MessageReactionUpdateAction,
  MessageAuthorKind,
  MessageLinkPreviewStatus,
  MessageLinkPreview,
  MessageMetadata,
  MessageReaction,
  RepliedMessage,
  Message,
  EventMessageDelivered,
  EventSendMessage,
  EventEditMessage,
  EventMessageEdited,
  EventMessageLinkPreviewUpdated,
  EventUpdateMessageStatus,
  EventMessagesStatusUpdated,
  EventChangeMessageStatus,
  EventLoadRoomMessages,
  EventRoomMessagesLoaded,
  EventUpdatePinnedMessage,
  EventPinnedMessageUpdated,
  EventDeleteMessage,
  EventAddReaction,
  EventMessageDeleted,
  EventUpdatedMessageReactions
} from './message/types'

export type {
  ChangePasswordPayload,
  CreateNewPasswordPayload,
  UpdateUserDataPayload,
  UpdateUserOnboardingPayload
} from './requests/types'

export type {
  CodeRequestResponse,
  ConfirmEmailResponse,
  RequestCooldownResponse,
  SendConfirmationLinkResponse,
  ValidateChangeEmailCodeResponse,
  ValidatePasswordRecoveryCodeResponse
} from './response/types'

export { SENTRY_DSN_CLIENT, SENTRY_IGNORED_SUBSTRINGS } from './sentry/constants'
export { isIgnoredSentryStatus, shouldIgnoreSentryError } from './sentry/lib'
export type { SentryErrorContext } from './sentry/types'

export type {
  CaptchaTokenPayload,
  ProtectedActionResponsePayload,
  ProtectedActionReason,
  SecurityAction
} from './security/types'

export {
  CLIENT_VERSION_HEADER,
  DAY_IN_MS,
  DAY_IN_SEC,
  firebaseProviders,
  HOUR_IN_MS,
  HOUR_IN_SEC,
  MB_IN_BYTES,
  MINUTE_IN_MS,
  MINUTE_IN_SEC,
  NATIVE_AUTH_ACCESS_TOKEN_HEADER,
  NATIVE_AUTH_CLIENT_HEADER,
  NATIVE_AUTH_DEVICE_ID_HEADER,
  NATIVE_AUTH_REFRESH_TOKEN_HEADER,
  providers,
  ROOM_PARTICIPANT_LIMIT,
  SECOND_IN_MS,
  WEEK_IN_MS
} from './shared/constants'
export { formatAppName, isBoolean, isFunction, isNumber, isString, isUnknownObject } from './shared/lib'
export type {
  AuthTokens,
  FirebaseProvider,
  Provider,
  AvailableCookie,
  UnknownCallback,
  UnknownObject,
  BasicStreamSettings,
  StreamSettings,
  BackendMessage,
  BackendResponse,
  TransportMeta,
  NativeAuthSession
} from './shared/types'

export type {
  EventErrorMessage,
  SocketAckSuccess,
  SocketAckFailure,
  SocketAckResponse,
  SocketAckCallback,
  SocketEventPayloadHandler,
  SocketAckEventPayloadHandler,
  SocketEventMap,
  ClientToServerSocketPayloadMap,
  ClientToServerSocketAckPayloadMap,
  ServerToClientSocketPayloadMap,
  ClientToServerSocketEvents,
  ServerToClientSocketEvents,
  ClientToServerSocketAction,
  ClientToServerSocketAckAction,
  ServerToClientSocketAction,
  ServerToClientSocketAckAction,
  RoomCallSignalDeliveryAck,
  SocketAppActions,
  SocketSystemActions,
  EventAuthError,
  SocketActions
} from './socket/types'

export {
  HTTP_REDIRECT_STATUS_MAX,
  HTTP_REDIRECT_STATUS_MIN,
  HTTP_SUCCESS_STATUS_MAX,
  HTTP_SUCCESS_STATUS_MIN,
  REQ_STATUS
} from './status/constants'
export { isHttpRedirectStatus, isHttpSuccessStatus } from './status/lib'
export type { ReqStatus } from './status/types'

export { formatHumanDateTime, normalizeTimestamp } from './time/lib'

export {
  USER_DEFAULT_ONBOARDING,
  USER_NICKNAME_MAX_LENGTH,
  USER_NICKNAME_MIN_LENGTH,
  USER_ROLES
} from './user/constants'
export { isNicknameValid, normalizeNicknameKey } from './user/lib'
export type { UserRole, UserOnboardingData, UserPreview, UserData } from './user/types'

export { VALIDATION_I18N } from './validation/i18n'
export { createValidationMessages } from './validation/messages'
export {
  EMAIL_PATTERN,
  NICKNAME_MAX_LENGTH_PATTERN,
  NICKNAME_MIN_LENGTH_PATTERN,
  NICKNAME_PATTERN,
  NON_EMPTY_PATTERN,
  PASSWORD_MIN_LENGTH_PATTERN,
  PASSWORD_NO_SPACES_PATTERN,
  PASSWORD_ONLY_LATIN_PATTERN,
  PASSWORD_STRONG_PATTERN
} from './validation/constants'
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
  createUpdateUserOnboardingSchema,
  createWebPushSubscriptionSchema,
  createDeleteWebPushSubscriptionSchema,
  createValidatePasswordRecoveryCodeSchema
} from './validation/schemas'
export type { ValidationI18n, ValidationMessages } from './validation/types'
