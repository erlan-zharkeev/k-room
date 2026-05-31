import type { INmorphCustomFileData, INmorphTagItemProps } from '@nmorph/nmorph-ui-kit'
import type { VirtualItem } from '@tanstack/vue-virtual'
import type {
  AudioObject,
  DocumentObject,
  ImageObject,
  MediaId,
  MediaKind,
  MediaObject,
  MessageLinkPreview,
  MessageReaction,
  RepliedMessage
} from 'global-shared'
import type { Component, Ref } from 'vue'

import type { ChatRoomRecord, MessageRecord } from 'src/shared/lib'

import type {
  MESSAGE_ATTACHMENT_DRAFT_KIND,
  MESSAGE_CONTEXT_MENU_ACTION,
  MESSAGE_DRAFT_REFERENCE_KIND,
  MESSAGE_STATUS_DOT_TONE,
  MESSAGE_TEXT_SEGMENT_KIND
} from './constants'

export interface ChatRoomMessagesProps {
  room: ChatRoomRecord
  isPrivateRoom: boolean
  targetMessageId: string
}

export interface ChatRoomHeaderProps {
  room: ChatRoomRecord
  isPrivateRoom: boolean
}

export interface ChatRoomFooterProps {
  room: ChatRoomRecord
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
  room: ChatRoomRecord
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
  message: MessageRecord
  room: ChatRoomRecord
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
  message: MessageRecord
  room: ChatRoomRecord
}

export interface MessageStatusDotsProps {
  message: MessageRecord
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

export interface MessageDocumentCardProps {
  document: DocumentObject
}

export interface MessageDocumentListProps {
  documents: DocumentObject[]
}

export interface MessageAttachmentDraftListBaseItem {
  src: string
  name: string
}

export interface MessageAttachmentDraftListImageItem extends MessageAttachmentDraftListBaseItem {
  kind: typeof MESSAGE_ATTACHMENT_DRAFT_KIND.IMAGE
}

export type MessageAttachmentDraftListFileKind =
  | typeof MESSAGE_ATTACHMENT_DRAFT_KIND.DOCUMENT
  | typeof MESSAGE_ATTACHMENT_DRAFT_KIND.AUDIO

export type MessageAttachmentDraftFileMediaObject = DocumentObject | AudioObject

export interface MessageAttachmentDraftListFileItem extends MessageAttachmentDraftListBaseItem {
  kind: MessageAttachmentDraftListFileKind
  contentType?: string
  size?: number
}

export type MessageAttachmentDraftListItem =
  | MessageAttachmentDraftListImageItem
  | MessageAttachmentDraftListFileItem

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

export interface UseMessageMediaDraftParams<Media extends MediaObject> {
  draftMediaIdPrefix: string
  mediaKind: MediaKind
  buildMediaObject: (file: File, id: string) => Media
  buildPayloadObject: (file: File) => Promise<Media>
}

export interface MessageAttachmentUploadGroups {
  validImageUploadValues: INmorphCustomFileData[]
  validDocumentUploadValues: INmorphCustomFileData[]
  validAudioUploadValues: INmorphCustomFileData[]
  sizeRejectedImageUploadValues: INmorphCustomFileData[]
  sizeRejectedDocumentUploadValues: INmorphCustomFileData[]
  sizeRejectedAudioUploadValues: INmorphCustomFileData[]
  limitRejectedUploadValues: INmorphCustomFileData[]
}

export type MessageContextMenuAction = (typeof MESSAGE_CONTEXT_MENU_ACTION)[keyof typeof MESSAGE_CONTEXT_MENU_ACTION]
export type MessageStatusDotTone = (typeof MESSAGE_STATUS_DOT_TONE)[keyof typeof MESSAGE_STATUS_DOT_TONE]

export interface MessageContextMenuProps {
  message: MessageRecord
  room: ChatRoomRecord
}

export interface MessageDeleteDialogProps {
  message: MessageRecord
  roomId: string
}

export interface MessageForwardDialogProps {
  message: MessageRecord
  sourceRoomId: string
}

export interface MessageLoadedRange {
  startIndex: number
  endIndex: number
}

export interface ChatRoomMessageNavigationParams {
  room: Ref<ChatRoomRecord>
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
  messageById: Map<string, MessageRecord>
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
  message: MessageRecord
  room: ChatRoomRecord
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
  message: MessageRecord
}

export type MessageListItem = MessageListGapItem | MessageListDateSeparatorItem | MessageListMessageItem

export type MessageVirtualListItem = MessageListGapItem | MessageListDateSeparatorItem | MessageVirtualListMessageItem

export interface MessageVirtualListItemProps {
  item: MessageVirtualListItem
  virtualItem: VirtualItem
}
