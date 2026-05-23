import type { VirtualItem } from '@tanstack/vue-virtual'
import type { ChatKind } from 'global-shared'
import type { RouteLocationRaw } from 'vue-router'

import type { ChatRoomRecord } from 'src/shared/lib'
import type { MessageRecord } from 'src/shared/lib'

export interface ChatRoomNavigationItem {
  id: string
  adminId: string
  chatKind: ChatKind
  to: RouteLocationRaw
  title: string
  description: string
  imageId: string
  online: boolean
  selected: boolean
  lastMessageCreatedAt: number
  unreadMessagesQuantity: number
  isPinned: boolean
  pinnedOrder: number | null
  isMuted: boolean
}

export interface ChatRoomListItemProps {
  item: ChatRoomNavigationItem
}

export interface ChatRoomContextMenuProps {
  item: ChatRoomNavigationItem
}

export interface ChatRoomContextMenuOption {
  label: string
  value: 'mark-as-read' | 'pin-chat' | 'unpin-chat' | 'mute-chat' | 'unmute-chat' | 'delete-chat' | 'leave-group'
  disabled?: boolean
}

export interface ChatRoomDeleteDialogProps {
  item: ChatRoomNavigationItem
}

export interface ChatRoomLeaveDialogProps {
  item: ChatRoomNavigationItem
}

export type CreateChatRoomDialogEmit = {
  (event: 'open-room', roomId: string): void
}

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
