import type {
  INmorphCustomFileData,
  INmorphTagItemProps,
  NmorphFileCardMediaPreview,
  NmorphMediaGalleryItem
} from '@nmorph/nmorph-ui-kit'
import type { VirtualItem } from '@tanstack/vue-virtual'
import type {
  AudioObject,
  ChatRoom,
  DocumentObject,
  ImageObject,
  MediaId,
  MediaKind,
  MediaObject,
  Message,
  MessageLinkPreview,
  MessageReaction,
  RoomCall,
  RoomCallMediaKind,
  RoomCallParticipantMediaState,
  RepliedMessage,
  VideoObject
} from 'global-shared'
import type { Component, Ref } from 'vue'

import type { RoomCallRemoteStreamsByUserId } from 'src/features/room-call-session'

import type {
  CHAT_ROOM_CONTENT_VIEW,
  MESSAGE_ATTACHMENT_DRAFT_KIND,
  MESSAGE_CONTEXT_MENU_ACTION,
  MESSAGE_DRAFT_REFERENCE_KIND,
  MESSAGE_MEDIA_GALLERY_ITEM_KIND,
  MESSAGE_STATUS_DOT_TONE,
  MESSAGE_TEXT_SEGMENT_KIND,
  ROOM_CALL_PANEL_DISPLAY_MODE
} from './constants'

export type ChatRoomContentView = (typeof CHAT_ROOM_CONTENT_VIEW)[keyof typeof CHAT_ROOM_CONTENT_VIEW]

export interface ChatRoomMessagesProps {
  room: ChatRoom
  isPrivateRoom: boolean
  targetMessageId: string
}

export interface ChatRoomHeaderProps {
  room: ChatRoom
  isPrivateRoom: boolean
  hasRoomCall: boolean
  contentView: ChatRoomContentView
  joinableRoomCall?: RoomCall
  isRoomCallStartDisabled: boolean
  isRoomCallStarting: boolean
  roomCallLoadingMediaKind: RoomCallMediaKind | null
}

export interface ChatRoomHeaderEmits {
  'update-content-view': [view: ChatRoomContentView]
  'start-room-call': [mediaKind: RoomCallMediaKind]
}

export type ChatRoomHeaderEmit = {
  (event: 'update-content-view', view: ChatRoomContentView): void
  (event: 'start-room-call', mediaKind: RoomCallMediaKind): void
}

export interface ChatRoomFooterProps {
  room: ChatRoom
}

export interface RoomCallPanelProps {
  roomCall: RoomCall
  videoStream?: MediaStream | null
  screenStream?: MediaStream | null
  remoteStreamsByUserId: RoomCallRemoteStreamsByUserId
  localMediaState: RoomCallParticipantMediaState
  isBusy: boolean
  isLeaving: boolean
}

export interface RoomCallPanelEmits {
  'set-audio-enabled': [enabled: boolean]
  'set-video-enabled': [enabled: boolean]
  'start-screen': []
  'stop-screen': []
  leave: []
}

export type RoomCallPanelEmit = {
  (event: 'set-audio-enabled', enabled: boolean): void
  (event: 'set-video-enabled', enabled: boolean): void
  (event: 'start-screen'): void
  (event: 'stop-screen'): void
  (event: 'leave'): void
}

export type RoomCallPanelDisplayMode = (typeof ROOM_CALL_PANEL_DISPLAY_MODE)[keyof typeof ROOM_CALL_PANEL_DISPLAY_MODE]

export interface RoomCallTileItem {
  avatarId?: MediaId | null
  id: string
  isLocal: boolean
  mediaState: RoomCallParticipantMediaState
  mirrored: boolean
  name: string
  stream?: MediaStream
}

export interface RoomCallTileProps {
  item: RoomCallTileItem
  self: boolean
}

export interface RoomCallTileEmits {
  select: []
}

export interface BuildRoomCallTileItemsParams {
  currentUserId: string
  roomCall: RoomCall
  localMediaState: RoomCallParticipantMediaState
  videoStream?: MediaStream | null
  screenStream?: MediaStream | null
  remoteStreamsByUserId: RoomCallRemoteStreamsByUserId
  resolveParticipantAvatarId: (userId: string) => MediaId | null | undefined
  resolveParticipantName: (userId: string) => string
}

export interface ChatRoomFooterEmits {
  'select-editing-message': [messageId: string]
}

export type ChatRoomFooterSelectEditingMessage = (messageId: string) => void

export interface MessageAttachmentUploadExpose {
  inputDOMRef?: HTMLInputElement
}

export interface UseMessageAttachmentDraftParams {
  editingMessageImages: Ref<ImageObject[]>
  removeEditingMessageImage: (imageSrc: string) => void
}

export interface EditingMessageState {
  roomId: string
  messageId: string
  initialBody: string
  initialImages: ImageObject[]
}

export type MessageDraftReferenceKind = (typeof MESSAGE_DRAFT_REFERENCE_KIND)[keyof typeof MESSAGE_DRAFT_REFERENCE_KIND]

export interface MessageDraftReferenceState {
  roomId: string
  kind: MessageDraftReferenceKind
  message: RepliedMessage
}

export interface ChatRoomPinnedMessageProps {
  room: ChatRoom
}

export interface ChatRoomPinnedMessageEmits {
  select: [messageId: string]
}

export interface ChatRoomMessageSelection {
  roomId: string
  messageId: string
}

export interface ChatRoomMessagesEmits {
  'select-message': [selection: ChatRoomMessageSelection]
  'target-message-scrolled': []
}

export type ChatRoomMessagesTargetMessageScrolled = () => void

export interface MessageBodyProps {
  isPrivateRoom: boolean
  message: Message
  room: ChatRoom
}

export interface MessageBodyEmits {
  'select-message': [selection: ChatRoomMessageSelection]
}

export type MessageBodySelectMessage = (selection: ChatRoomMessageSelection) => void

export interface MessageTextProps {
  text: string
}

export type MessageTextSegmentKind = (typeof MESSAGE_TEXT_SEGMENT_KIND)[keyof typeof MESSAGE_TEXT_SEGMENT_KIND]

export interface MessageTextPlainSegment {
  id: string
  kind: typeof MESSAGE_TEXT_SEGMENT_KIND.TEXT
  text: string
}

export interface MessageTextLinkSegment {
  id: string
  kind: typeof MESSAGE_TEXT_SEGMENT_KIND.LINK
  text: string
  href: string
}

export type MessageTextSegment = MessageTextPlainSegment | MessageTextLinkSegment

export interface MessageLinkPreviewProps {
  preview: MessageLinkPreview
}

export interface MessageReactionsProps {
  message: Message
  room: ChatRoom
}

export interface MessageStatusDotsProps {
  message: Message
}

export interface MessageReactionGroupUser {
  authorId: string
  avatarId?: MediaId | null
  nickname: string
}

export interface MessageReactionGroup {
  glyphKey: string
  users: MessageReactionGroupUser[]
  visibleUsers: MessageReactionGroupUser[]
  count: number
  isSelected: boolean
}

export interface MessageReactionTagItem extends MessageReactionGroup, INmorphTagItemProps {
  color: string
  height: 'thin'
  removable: false
  value: string
}

export interface MessageReactionDetailsItem {
  id: string
  glyphKey: string
  user: MessageReactionGroupUser
}

export interface BuildMessageReactionGroupsParams {
  currentUserId: string
  getUserAvatarId: (authorId: string) => MediaId | null | undefined
  reactions?: MessageReaction[]
  visibleUserLimit: number
}

export interface CanToggleMessageReactionParams {
  currentUserId: string
  glyphKey: string
  limit: number
  reactions?: MessageReaction[]
}

export interface MessageReactionAvatarProps {
  user: MessageReactionGroupUser
}

export interface MessagePreviewProps {
  title: string
  text: string
}

export type MessageFileListFile = AudioObject | DocumentObject
export type MessageFileListMediaPreview = Extract<NmorphFileCardMediaPreview, 'none' | 'audio'>

export interface MessageFileListItem {
  id: string
  name: string
  contentType?: string
  size?: number
  downloadHref?: string
  previewSrc?: string
  mediaPreview: MessageFileListMediaPreview
}

export interface MessageFileListProps {
  files: MessageFileListFile[]
  mediaPreview: MessageFileListMediaPreview
}

export interface MessageMediaGalleryProps {
  images: ImageObject[]
  videos: VideoObject[]
}

export type MessageMediaGalleryItemKind =
  (typeof MESSAGE_MEDIA_GALLERY_ITEM_KIND)[keyof typeof MESSAGE_MEDIA_GALLERY_ITEM_KIND]

export type MessageMediaGalleryItem = NmorphMediaGalleryItem & {
  id: string
  mediaId: string
  name: string
}

export interface MessageAttachmentDraftListBaseItem extends Pick<MediaObject, 'name' | 'src'> {
  contentType?: string
  size?: number
}

export interface MessageAttachmentDraftListImageItem extends MessageAttachmentDraftListBaseItem {
  kind: typeof MESSAGE_ATTACHMENT_DRAFT_KIND.IMAGE
}

export type MessageAttachmentDraftListFileKind =
  | typeof MESSAGE_ATTACHMENT_DRAFT_KIND.DOCUMENT
  | typeof MESSAGE_ATTACHMENT_DRAFT_KIND.AUDIO
  | typeof MESSAGE_ATTACHMENT_DRAFT_KIND.VIDEO

export interface MessageAttachmentDraftListFileItem extends MessageAttachmentDraftListBaseItem {
  kind: MessageAttachmentDraftListFileKind
}

export type MessageAttachmentDraftListItem = MessageAttachmentDraftListImageItem | MessageAttachmentDraftListFileItem

export interface MessageAttachmentDraftListProps {
  attachments: MessageAttachmentDraftListItem[]
  removeAriaLabel: string
}

export interface MessageAttachmentDraftListEmits {
  remove: [attachment: MessageAttachmentDraftListItem]
}

export interface MessageMediaDraftItem {
  id: string
  file: File
  uploadValue: INmorphCustomFileData
}

export type MessageMediaDraftObjectDetails<Media extends MediaObject> = Partial<Omit<Media, keyof MediaObject>>

export interface UseMessageMediaDraftParams<Media extends MediaObject> {
  draftMediaIdPrefix: string
  mediaKind: MediaKind
  buildMediaObjectDetails?: (file: File) => MessageMediaDraftObjectDetails<Media>
}

export interface MessageAttachmentUploadGroups {
  validImageUploadValues: INmorphCustomFileData[]
  validDocumentUploadValues: INmorphCustomFileData[]
  validAudioUploadValues: INmorphCustomFileData[]
  validVideoUploadValues: INmorphCustomFileData[]
  sizeRejectedImageUploadValues: INmorphCustomFileData[]
  sizeRejectedDocumentUploadValues: INmorphCustomFileData[]
  sizeRejectedAudioUploadValues: INmorphCustomFileData[]
  sizeRejectedVideoUploadValues: INmorphCustomFileData[]
  limitRejectedUploadValues: INmorphCustomFileData[]
}

export type MessageContextMenuAction = (typeof MESSAGE_CONTEXT_MENU_ACTION)[keyof typeof MESSAGE_CONTEXT_MENU_ACTION]
export type MessageStatusDotTone = (typeof MESSAGE_STATUS_DOT_TONE)[keyof typeof MESSAGE_STATUS_DOT_TONE]

export interface MessageContextMenuProps {
  message: Message
  room: ChatRoom
}

export interface MessageDeleteDialogProps {
  message: Message
  roomId: string
}

export interface MessageForwardDialogProps {
  message: Message
  sourceRoomId: string
}

export interface MessageLoadedRange {
  startIndex: number
  endIndex: number
}

export interface ChatRoomMessageNavigationParams {
  room: Ref<ChatRoom>
  targetMessageId: Ref<string>
  findLoadedRangeByMessageIndex: (roomId: string, index: number) => MessageLoadedRange | undefined
  loadMessagesAround: (messageId: string) => Promise<void>
  scrollToMessage: (messageId: string) => Promise<void>
  onTargetMessageScrolled: ChatRoomMessagesTargetMessageScrolled
}

export interface MessageListBuildParams {
  roomId: string
  messageIds: string[]
  loadedMessageRanges: MessageLoadedRange[]
  messageById: Map<string, Message>
  formatDate: (timestamp: number) => string
}

export interface MessageContextMenuOption {
  label?: string
  value: MessageContextMenuAction
  icon?: Component
  component?: Component
  componentProps?: Record<string, unknown>
  closeOnClick?: boolean
  disabled?: boolean
}

export interface MessageReactionPickerProps {
  message: Message
  room: ChatRoom
}

export interface MessageReactionPickerEmits {
  select: []
}

export type MessageReactionPickerEmit = (event: 'select') => void

export interface DateSeparatorProps {
  label: string
}

export interface MessageListGapItem {
  type: 'message-gap'
  id: string
}

export interface MessageListDateSeparatorItem {
  type: 'date-separator'
  id: string
  label: string
}

export interface MessageListMessageItem {
  type: 'message'
  id: string
  messageId: string
}

export interface MessageVirtualListMessageItem extends MessageListMessageItem {
  message: Message
}

export type MessageListItem = MessageListGapItem | MessageListDateSeparatorItem | MessageListMessageItem

export type MessageVirtualListItem = MessageListGapItem | MessageListDateSeparatorItem | MessageVirtualListMessageItem

export interface MessageVirtualListItemProps {
  item: MessageVirtualListItem
  virtualItem: VirtualItem
}
