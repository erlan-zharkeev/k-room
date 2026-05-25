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

export interface MessageBodyProps {
  isPrivateRoom: boolean
  message: MessageRecord
  roomId: string
}

export type MessageContextMenuAction = (typeof MESSAGE_CONTEXT_MENU_ACTION)[keyof typeof MESSAGE_CONTEXT_MENU_ACTION]

export interface MessageContextMenuProps {
  message: MessageRecord
  roomId: string
}

export interface MessageDeleteDialogProps {
  message: MessageRecord
  roomId: string
}

export interface MessageContextMenuOption {
  label: string
  value: MessageContextMenuAction
  disabled?: boolean
}

export interface DateSeparatorProps {
  label: string
}

export interface MessageListLoadOlderItem {
  type: 'load-older'
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

export type MessageListItem = MessageListLoadOlderItem | MessageListDateSeparatorItem | MessageListMessageItem

export type MessageVirtualListItem =
  | MessageListLoadOlderItem
  | MessageListDateSeparatorItem
  | MessageVirtualListMessageItem

export interface MessageVirtualListItemProps {
  item: MessageVirtualListItem
  virtualItem: VirtualItem
}
