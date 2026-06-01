export { PASSWORD_SPECIAL_CHARACTERS, VALIDATION_LIMITS, VALIDATION_PATTERNS } from './auth/constants'
export type {
  AuthLoginPayload,
  AuthRegistrationPayload,
  SendConfirmationLinkPayload,
  SignInWithProviderPayload
} from './auth/types'

export type {
  CallStatus,
  CallFlow,
  Call,
  EventMarkCallAsVideo,
  EventCallUpdated,
  EventCallsUpdated,
  EventCallUser,
  EventChangeCallSettings,
  EventCallAccepted,
  EventAnswerCall,
  EventCallStartedAt,
  EventCallEnded
} from './calls/types'

export {
  CHAT_KIND,
  CHAT_ROOM_GROUP_MEMBER_LIMIT,
  CHAT_ROOM_NAME_MAX_LENGTH,
  PINNED_CHAT_ROOM_LIMIT,
  USER_CHAT_ROOM_LIMIT
} from './chat/constants'
export { isRoomAdmin } from './chat/lib/is-room-admin'
export { isRoomGroup } from './chat/lib/is-room-group'
export { isRoomPrivate } from './chat/lib/is-room-private'
export { getRoomInterlocutorId, getRoomOtherUserIds } from './chat/lib/get-room-user-ids'
export type {
  ChatRoom,
  ChatRooms,
  ChatKind,
  EventGetRoom,
  EventGetRooms,
  EventCreateRoom,
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
export type {
  Codes,
  CodeValidationPayload,
  SendChangeEmailCodePayload,
  SendPasswordRecoveryCodePayload,
  ValidateChangeEmailCodePayload
} from './codes/types'

export type {
  Interaction,
  Contact,
  KnownUser,
  ContactMap,
  EventStatusContact,
  EventChangeContactsData,
  EventGetContacts,
  EventKnownUsersUpdated,
  EventSaveContact,
  EventDeleteContact,
  EventSearchContact,
  EventGetSearchedContact,
  EventGetContactTypingStatus,
  EventUpdateInteraction,
  EventInviteReceived,
  EventUpdateContactInteractionSuccess,
  EventContactAddSuccess,
  EventDeleteContactSuccess
} from './contact/types'
export {
  CONTACT_INTERACTION,
  CONTACT_LIMIT,
  CONTACT_SEARCH_QUERY_MAX_LENGTH,
  CONTACT_SEARCH_RESULT_LIMIT
} from './contact/constants'
export {
  isAcceptedContactInteraction,
  isBlockedContactInteraction,
  isDefaultContactInteraction,
  isInvitedContactInteraction,
  isInviteReceivedContactInteraction,
  isPendingContactInteraction
} from './contact/lib/contact-interaction'

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
export type { RouteName, Endpoints } from './endpoints/types'

export type { EnvVariables, EnvSharedVariables } from './env/types'
export { parseEnvContent, readEnv, readSecretEnv } from './env/lib/read-env'
export type { EnvSource, ReadEnvOptions, SecretEnvFileReader } from './env/lib/read-env'

export { APP_LANGUAGE, APP_LANGUAGE_VALUES, APP_LANGUAGE_HEADER, DEFAULT_APP_LANGUAGE } from './language/constants'
export { defineI18n } from './language/lib/define-i18n'
export type { AppLanguage, EventUpdateLanguage, LocalizedText, LocalizedTextMap } from './language/types'
export type { I18nValueConstraint, I18nRecordConstraint } from './language/lib/types'

export {
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
  MediaFileValue,
  EventMediaFilesDeleted
} from './media/types'

export type { PackageData } from './package/types'

export {
  MESSAGE_ATTACHMENT_LIMIT,
  MESSAGE_BODY_MAX_LENGTH,
  MESSAGE_LINK_CANDIDATE_PATTERN,
  MESSAGE_LINK_PREVIEW_STATUS,
  MESSAGE_LINK_PROTOCOL,
  MESSAGE_LINK_TRAILING_PUNCTUATION_PATTERN,
  MESSAGE_LOAD_DIRECTION,
  MESSAGE_LOAD_LIMIT_MAX,
  MESSAGE_REACTION_LIMIT_PER_USER,
  MESSAGE_REACTION_UPDATE_ACTION,
  MESSAGE_STATUS,
  MESSAGE_STATUS_VALUE
} from './message/constants'
export { buildPendingMessageLinkPreview } from './message/lib/message-link-preview'
export { isMessageAuthor } from './message/lib/message-author'
export { isMessageStatusDelivered, isMessageReadStatus, isMessageSendingStatus } from './message/lib/message-status'
export type {
  MessageStatus,
  MessageLoadDirection,
  MessageReactionUpdateAction,
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

export type { ChangePasswordPayload, CreateNewPasswordPayload } from './requests/types'

export type {
  ConfirmEmailResponse,
  LoginResponse,
  SignInWithProviderResponse,
  GetUserDataResponse,
  SendConfirmationLinkResponse,
  SendChangeEmailCodeResponse,
  SendPasswordRecoveryCodeResponse,
  ValidateChangeEmailCodeResponse,
  ValidatePasswordRecoveryCodeResponse
} from './response/types'

export { SENTRY_IGNORED_SUBSTRINGS } from './sentry/constants'
export { isIgnoredSentryStatus, shouldIgnoreSentryError } from './sentry/lib/should-ignore-sentry-error'
export type { SentryErrorContext } from './sentry/types'

export { PROTECTED_ACTION_REASON, SECURITY_ACTION } from './security/constants'
export type {
  CaptchaTokenPayload,
  ProtectedActionResponsePayload,
  ProtectedActionReason,
  SecurityAction
} from './security/types'

export {
  DAY_IN_MS,
  DAY_IN_SEC,
  firebaseProviders,
  HOUR_IN_MS,
  HOUR_IN_SEC,
  MB_IN_BYTES,
  MINUTE_IN_MS,
  MINUTE_IN_SEC,
  providers,
  SECOND_IN_MS,
  WEEK_IN_MS
} from './shared/constants'
export { formatAppName } from './shared/lib/format-app-name'
export { isBoolean, isFunction, isNumber, isString, isUnknownObject } from './shared/lib/type-guards'
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
  BackendResponse
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
export { isHttpRedirectStatus, isHttpSuccessStatus } from './status/lib/http-status'
export type { ReqStatus } from './status/types'

export { normalizeTimestamp } from './time/lib/normalize-timestamp'
export { formatHumanDateTime } from './time/lib/format-human-date-time'

export { USER_NICKNAME_MAX_LENGTH, USER_NICKNAME_MIN_LENGTH, USER_ROLES } from './user/constants'
export { formatNickname, isNicknameValid, normalizeNickname, normalizeNicknameKey } from './user/lib/nickname'
export type { UserRole, UserPreview, UserData } from './user/types'

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
  createValidatePasswordRecoveryCodeSchema
} from './validation/schemas'
export type { ValidationI18n, ValidationMessages } from './validation/types'
