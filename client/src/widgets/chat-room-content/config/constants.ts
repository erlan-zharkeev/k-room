import {
  MB_IN_BYTES,
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP,
  MEDIA_VALIDATION_OPTIONS_MAP,
  type MessageStatus,
  type RoomCallTemporaryQuickCommand
} from 'global-shared'

import type { RoomCallConnectionQuality } from 'src/features/room-call-session'

import { CHAT_ROOM_CONTENT_I18N } from './i18n'
import type {
  MessageStatusDotTone,
  RoomCallConnectionQualityBarLevel,
  RoomCallPanelDisplayMode,
  RoomCallQuickCommand
} from './types'

export const ROOM_MESSAGES_PAGE_LIMIT = 30
export const ROOM_MESSAGES_PRELOAD_EDGE_ITEMS = 20
export const CHAT_ROOM_CONTENT_VIEW_QUERY_KEY = 'chat-view'
export const ROOM_CALL_SCREEN_TILE_ID_SUFFIX = 'screen'
export const ROOM_CALL_PANEL_GRID_ROWS_PER_COLUMN = 2
export const ROOM_CALL_PANEL_DISPLAY_MODE_TOGGLE_I18N = {
  focus: CHAT_ROOM_CONTENT_I18N.roomCallGridDisplayMode,
  grid: CHAT_ROOM_CONTENT_I18N.roomCallFocusDisplayMode
} as const satisfies Record<
  RoomCallPanelDisplayMode,
  (typeof CHAT_ROOM_CONTENT_I18N)[keyof typeof CHAT_ROOM_CONTENT_I18N]
>
export const ROOM_CALL_QUICK_COMMANDS = [
  {
    i18n: CHAT_ROOM_CONTENT_I18N.roomCallQuickCommandRaiseHand,
    id: 'raise-hand'
  },
  {
    i18n: CHAT_ROOM_CONTENT_I18N.roomCallQuickCommandOk,
    id: 'ok'
  },
  {
    i18n: CHAT_ROOM_CONTENT_I18N.roomCallQuickCommandYes,
    id: 'yes'
  },
  {
    i18n: CHAT_ROOM_CONTENT_I18N.roomCallQuickCommandNo,
    id: 'no'
  }
] as const satisfies readonly {
  i18n: (typeof CHAT_ROOM_CONTENT_I18N)[keyof typeof CHAT_ROOM_CONTENT_I18N]
  id: RoomCallQuickCommand
}[]
export const ROOM_CALL_TEMPORARY_QUICK_COMMAND_I18N_BY_COMMAND = {
  no: CHAT_ROOM_CONTENT_I18N.roomCallQuickCommandNo,
  ok: CHAT_ROOM_CONTENT_I18N.roomCallQuickCommandOk,
  yes: CHAT_ROOM_CONTENT_I18N.roomCallQuickCommandYes
} as const satisfies Record<
  RoomCallTemporaryQuickCommand,
  (typeof CHAT_ROOM_CONTENT_I18N)[keyof typeof CHAT_ROOM_CONTENT_I18N]
>
export const ROOM_CALL_TEMPORARY_QUICK_COMMAND_TEXT_COLOR_BY_COMMAND = {
  no: 'error-text',
  ok: 'accent',
  yes: 'success'
} as const satisfies Record<RoomCallTemporaryQuickCommand, string>
export const ROOM_CALL_TILE_SELF_CONTROL_ICON_SIZE = '20px'
export const ROOM_CALL_TILE_STATE_ICON_SIZE = '16px'
export const ROOM_CALL_CONNECTION_QUALITY_BAR_LEVELS = [
  1, 2, 3
] as const satisfies readonly RoomCallConnectionQualityBarLevel[]
export const ROOM_CALL_CONNECTION_QUALITY_ACTIVE_BAR_COUNT_BY_KIND = {
  good: 3,
  poor: 1,
  reconnecting: 1,
  unstable: 2
} as const satisfies Record<RoomCallConnectionQuality, number>
export const MESSAGE_READ_VISIBILITY_RATIO = 0.5
export const MESSAGE_RANGE_GAP_HEIGHT = 24
export const MESSAGE_VIRTUAL_ESTIMATED_HEIGHT = 96
export const MESSAGE_VIRTUAL_GAP = 4
export const MESSAGE_VIRTUAL_OVERSCAN = 8
export const MESSAGE_VIRTUAL_PADDING_START = 12
export const MESSAGE_LOADING_PROGRESS_PERCENTAGE = 100
export const MESSAGE_BACK_TO_BOTTOM_VISIBLE_OFFSET = 120
export const MESSAGE_SCROLL_RESTORE_STABILIZATION_FRAMES = 2
export const MESSAGE_REMOVAL_MOTION_MS = 340
export const MESSAGE_REACTION_VISIBLE_GROUP_LIMIT = 3
export const MESSAGE_REACTION_VISIBLE_USER_LIMIT = 3
export const MESSAGE_CONTEXT_MENU_WIDTH = 274
export const MESSAGE_ATTACHMENT_DRAFT_IMAGE_SIZE_PX = 56
export const MESSAGE_ATTACHMENT_FILE_CARD_HEIGHT_PX = 60
export const MESSAGE_ATTACHMENT_SCROLL_X_BAR_WIDTH_PX = 6
export const MESSAGE_ATTACHMENT_SCROLL_X_GAP_PX = 6
export const MESSAGE_ATTACHMENT_DRAFT_LIST_HEIGHT_PX =
  MESSAGE_ATTACHMENT_FILE_CARD_HEIGHT_PX + MESSAGE_ATTACHMENT_SCROLL_X_BAR_WIDTH_PX + MESSAGE_ATTACHMENT_SCROLL_X_GAP_PX
export const MESSAGE_ATTACHMENT_FILE_WIDTH_PX = MESSAGE_ATTACHMENT_DRAFT_IMAGE_SIZE_PX * 4
export const MESSAGE_ATTACHMENT_VISUAL_FILE_CARD_WIDTH_PX = 168
export const MESSAGE_AUDIO_ALLOWED_TYPES =
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP[MEDIA_VALIDATION_OPTIONS_MAP.audio.supportedKindMediaType]
export const MESSAGE_VIDEO_ALLOWED_TYPES =
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP[MEDIA_VALIDATION_OPTIONS_MAP.video.supportedKindMediaType]
export const MESSAGE_DOCUMENT_ALLOWED_TYPES =
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP[MEDIA_VALIDATION_OPTIONS_MAP.doc.supportedKindMediaType]
export const MESSAGE_ARCHIVE_ALLOWED_TYPES = MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP.archive
export const MESSAGE_IMAGE_ALLOWED_TYPES =
  MEDIA_KIND_ALLOWED_UPLOAD_TYPES_MAP[MEDIA_VALIDATION_OPTIONS_MAP.image.supportedKindMediaType]
export const MESSAGE_ATTACHMENT_ALLOWED_TYPES = [
  ...MESSAGE_IMAGE_ALLOWED_TYPES,
  ...MESSAGE_DOCUMENT_ALLOWED_TYPES,
  ...MESSAGE_ARCHIVE_ALLOWED_TYPES,
  ...MESSAGE_AUDIO_ALLOWED_TYPES,
  ...MESSAGE_VIDEO_ALLOWED_TYPES
]
export const MESSAGE_AUDIO_MAX_MB = MEDIA_VALIDATION_OPTIONS_MAP.audio.maxMb
export const MESSAGE_AUDIO_MAX_FILE_SIZE = MESSAGE_AUDIO_MAX_MB * MB_IN_BYTES
export const MESSAGE_VIDEO_MAX_MB = MEDIA_VALIDATION_OPTIONS_MAP.video.maxMb
export const MESSAGE_VIDEO_MAX_FILE_SIZE = MESSAGE_VIDEO_MAX_MB * MB_IN_BYTES
export const MESSAGE_DOCUMENT_MAX_MB = MEDIA_VALIDATION_OPTIONS_MAP.doc.maxMb
export const MESSAGE_DOCUMENT_MAX_FILE_SIZE = MESSAGE_DOCUMENT_MAX_MB * MB_IN_BYTES
export const MESSAGE_IMAGE_MAX_MB = MEDIA_VALIDATION_OPTIONS_MAP.image.maxMb
export const MESSAGE_IMAGE_MAX_FILE_SIZE = MESSAGE_IMAGE_MAX_MB * MB_IN_BYTES
export const MESSAGE_STATUS_DOT_COUNT_BY_STATUS = {
  sending: 1,
  undelivered: 1,
  delivered: 1,
  read: 2,
  none: 0
} as const satisfies Record<MessageStatus, number>
export const MESSAGE_STATUS_DOT_TONE_BY_STATUS = {
  sending: 'text',
  undelivered: 'error',
  delivered: 'text',
  read: 'accent',
  none: 'text'
} as const satisfies Record<MessageStatus, MessageStatusDotTone>
