import type {
  INmorphCustomFileData,
  INmorphTagItemProps,
  NmorphFileCardMediaPreview,
  NmorphMediaGalleryItem
} from '@nmorph/nmorph-ui-kit'
import type { NmorphEmojiLocale } from '@nmorph/nmorph-ui-kit/emoji'
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
  RoomCallTemporaryQuickCommand,
  RepliedMessage,
  VideoObject
} from 'global-shared'
import type { Component, ComputedRef, Ref, ShallowRef } from 'vue'

import type {
  RoomCallHandRaisedByUserId,
  RoomCallConnectionQuality,
  RoomCallConnectionQualityByUserId,
  RoomCallRemoteStreamsByUserId,
  RoomCallTemporaryQuickCommandByUserId,
  RoomCallTemporaryQuickCommandState
} from 'src/features/room-call-session'
import type { AudioMeterAnalyser } from 'src/shared/lib'

export type ChatRoomContentView = 'text' | 'call'

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
  audioStream?: MediaStream | null
  videoStream?: MediaStream | null
  screenStream?: MediaStream | null
  connectionQualityByUserId: RoomCallConnectionQualityByUserId
  remoteStreamsByUserId: RoomCallRemoteStreamsByUserId
  handRaisedByUserId: RoomCallHandRaisedByUserId
  temporaryQuickCommandByUserId: RoomCallTemporaryQuickCommandByUserId
  localMediaState: RoomCallParticipantMediaState
  isBusy: boolean
  isLeaving: boolean
}

export interface RoomCallPanelEmits {
  'set-audio-enabled': [enabled: boolean]
  'set-video-enabled': [enabled: boolean]
  'start-screen': []
  'stop-screen': []
  'send-quick-command': [quickCommand: RoomCallTemporaryQuickCommand]
  'set-hand-raised': [handRaised: boolean]
  leave: []
}

export type RoomCallPanelEmit = {
  (event: 'set-audio-enabled', enabled: boolean): void
  (event: 'set-video-enabled', enabled: boolean): void
  (event: 'start-screen'): void
  (event: 'stop-screen'): void
  (event: 'send-quick-command', quickCommand: RoomCallTemporaryQuickCommand): void
  (event: 'set-hand-raised', handRaised: boolean): void
  (event: 'leave'): void
}

export type RoomCallPanelDisplayMode = 'focus' | 'grid'

export type RoomCallQuickCommand = 'no' | 'ok' | 'raise-hand' | 'yes'

export type RoomCallTileKind = 'participant' | 'screen'

export type RoomCallConnectionQualityBarLevel = 1 | 2 | 3

export interface RoomCallConnectionQualityBarItem {
  active: boolean
  level: RoomCallConnectionQualityBarLevel
  reconnecting: boolean
}

export interface RoomCallTileItem {
  audioActivityStream?: MediaStream | null
  avatarId?: MediaId | null
  connectionQuality?: RoomCallConnectionQuality
  id: string
  isHandRaised: boolean
  isLocal: boolean
  kind: RoomCallTileKind
  mediaState: RoomCallParticipantMediaState
  mirrored: boolean
  name: string
  stream?: MediaStream
  temporaryQuickCommand?: RoomCallTemporaryQuickCommandState
}

export interface RoomCallTileProps {
  item: RoomCallTileItem
  main?: boolean
  self: boolean
}

export interface RoomCallTileEmits {
  select: []
}

export interface RoomCallTileAudioActivityMonitor extends AudioMeterAnalyser {
  frameId: number
}

export interface BuildRoomCallTileItemsParams {
  currentUserId: string
  roomCall: RoomCall
  localMediaState: RoomCallParticipantMediaState
  connectionQualityByUserId: RoomCallConnectionQualityByUserId
  audioStream?: MediaStream | null
  videoStream?: MediaStream | null
  screenStream?: MediaStream | null
  remoteStreamsByUserId: RoomCallRemoteStreamsByUserId
  handRaisedByUserId: RoomCallHandRaisedByUserId
  temporaryQuickCommandByUserId: RoomCallTemporaryQuickCommandByUserId
  resolveParticipantAvatarId: (userId: string) => MediaId | null | undefined
  resolveParticipantName: (userId: string) => string
}

export interface ChatRoomFooterEmits {
  'select-editing-message': [messageId: string]
}

export type ChatRoomFooterSelectEditingMessage = (messageId: string) => void

export interface ChatRoomMessageEmojiPickerModel {
  messageEmojiDropdownAnchor: Readonly<ShallowRef<HTMLElement | null>>
  emojiPickerLocale: ShallowRef<NmorphEmojiLocale | undefined>
  emojiPickerQuickList: ComputedRef<string[]>
  isMessageEmojiDropdownOpen: Ref<boolean>
  closeMessageEmojiDropdown: () => void
  selectMessageEmoji: (emoji: string) => void
  toggleMessageEmojiDropdown: () => void
}

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

export type MessageDraftReferenceKind = 'reply' | 'forward'

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

export type MessageTextSegmentKind = 'text' | 'link'

export interface MessageTextPlainSegment {
  id: string
  kind: 'text'
  text: string
}

export interface MessageTextLinkSegment {
  id: string
  kind: 'link'
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

export type MessageMediaGalleryItemKind = 'image' | 'video'

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
  kind: 'image'
}

export type MessageAttachmentDraftListFileKind = 'document' | 'audio' | 'video'

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

export type MessageMediaDraftObjectDetails<Media extends MediaObject> = Partial<Omit<Media, keyof MediaObject>>

export type MessageMediaDraftObjectDetailsBuilder<Media extends MediaObject> = (
  file: File
) => MessageMediaDraftObjectDetails<Media> | Promise<MessageMediaDraftObjectDetails<Media>>

export interface MessageMediaDraftItem<Media extends MediaObject = MediaObject> {
  details: MessageMediaDraftObjectDetails<Media>
  id: string
  file: File
  uploadValue: INmorphCustomFileData
}

export interface UseMessageMediaDraftParams<Media extends MediaObject> {
  draftMediaIdPrefix: string
  mediaKind: MediaKind
  buildMediaObjectDetails?: MessageMediaDraftObjectDetailsBuilder<Media>
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

export type MessageContextMenuAction =
  | 'copy-text'
  | 'edit-message'
  | 'reply-message'
  | 'forward-message'
  | 'reaction-picker'
  | 'pin-message'
  | 'unpin-message'
  | 'delete-message'

export type MessageStatusDotTone = 'text' | 'accent' | 'error'

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
  component?: Component
  componentProps?: Record<string, unknown>
  closeOnClick?: boolean
  disabled?: boolean
}

export interface MessageContextMenuActionButtonProps {
  label: string
  disabled?: boolean
}

export interface MessageContextMenuActionButtonEmits {
  select: []
}

export interface MessageContextMenuActionItemProps {
  message: Message
  room: ChatRoom
}

export interface MessageContextMenuDialogActionItemProps extends MessageContextMenuActionItemProps {
  openDialog: () => void
}

export interface MessageContextMenuActionItemEmits {
  select: []
}

export type MessageContextMenuActionItemEmit = (event: 'select') => void

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

export interface ResolveVisibleMessageScrollAnchorStateParams {
  clientHeight: number
  messageList: MessageListItem[]
  scrollTop: number
  virtualItems: VirtualItem[]
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

export interface MessageRemovalOverlayItem {
  id: string
  isLeaving: boolean
  message: Message
  style: Record<'left' | 'top' | 'width', string>
}
