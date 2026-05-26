import type { VirtualItem } from '@tanstack/vue-virtual'

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

export interface MessageContextMenuOption {
  label: string
  value: MessageContextMenuAction
  disabled?: boolean
}

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
