import type { VirtualItem } from '@tanstack/vue-virtual'
import type { Component } from 'vue'

import type { ChatRoomRecord, MessageRecord } from 'src/shared/lib'

import type { MESSAGE_CONTEXT_MENU_ACTION } from './constants'

export interface ChatRoomMessagesProps {
  room: ChatRoomRecord
  isPrivateRoom: boolean
}

export interface ChatRoomHeaderProps {
  room: ChatRoomRecord
  isPrivateRoom: boolean
}

export interface ChatRoomFooterProps {
  room: ChatRoomRecord
}

export interface ChatRoomPinnedMessageProps {
  room: ChatRoomRecord
}

export interface ChatRoomPinnedMessageEmits {
  select: [messageId: string]
}

export interface ChatRoomMessagesExpose {
  loadAndScrollToMessage: (messageId: string) => Promise<void>
}

export interface MessageBodyProps {
  isPrivateRoom: boolean
  message: MessageRecord
  room: ChatRoomRecord
}

export interface MessageReactionsProps {
  message: MessageRecord
}

export interface MessageReactionGroupUser {
  authorId: string
  nickname: string
}

export interface MessageReactionGroup {
  glyphKey: string
  users: MessageReactionGroupUser[]
  count: number
}

export interface MessageReactionTagItem {
  value: string
  text: string
  removable: false
  height: 'thin'
  design: 'common'
}

export interface MessagePreviewProps {
  title: string
  text: string
}

export type MessageContextMenuAction = (typeof MESSAGE_CONTEXT_MENU_ACTION)[keyof typeof MESSAGE_CONTEXT_MENU_ACTION]

export interface MessageContextMenuProps {
  message: MessageRecord
  room: ChatRoomRecord
}

export interface MessageDeleteDialogProps {
  message: MessageRecord
  roomId: string
}

export interface MessageLoadedRange {
  startIndex: number
  endIndex: number
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
