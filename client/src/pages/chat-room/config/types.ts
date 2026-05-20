import type { VirtualItem } from '@tanstack/vue-virtual'
import type { RouteLocationRaw } from 'vue-router'

import type { FChatRoomType } from 'src/shared/lib'
import type { DbMessageType } from 'src/shared/lib'

export interface IChatRoomNavigationItem {
  id: string
  to: RouteLocationRaw
  title: string
  description: string
  imageId: string
  online: boolean
  selected: boolean
  lastMessageCreatedAt: number
  unreadMessagesQuantity: number
}

export interface IChatRoomListProps {
  items: IChatRoomNavigationItem[]
}

export interface IChatRoomListItemProps {
  item: IChatRoomNavigationItem
}

export interface IChatRoomContextMenuProps {
  item: IChatRoomNavigationItem
}

export interface IChatRoomContextMenuOption {
  label: string
  value: 'mark-as-read'
  disabled?: boolean
}

export interface ICreateChatRoomContactItemProps {
  contactId: string
  nickname: string
}

export type CreateChatRoomDialogEmitType = {
  (event: 'open-room', roomId: string): void
}

export interface IChatRoomMessagesProps {
  room: FChatRoomType
  isPrivateRoom: boolean
}

export interface IChatRoomHeaderProps {
  room: FChatRoomType
  isPrivateRoom: boolean
}

export interface IChatRoomFooterProps {
  room: FChatRoomType
}

export interface IMessageBodyProps {
  isPrivateRoom: boolean
  message: DbMessageType
}

export interface IDateSeparatorProps {
  label: string
}

export interface IMessageListLoadOlderItem {
  type: 'load-older'
  id: string
}

export interface IMessageListDateSeparatorItem {
  type: 'date-separator'
  id: string
  label: string
}

export interface IMessageListMessageItem {
  type: 'message'
  id: string
  messageId: string
}

export interface IMessageVirtualListMessageItem extends IMessageListMessageItem {
  message: DbMessageType
}

export type MessageListItemType = IMessageListLoadOlderItem | IMessageListDateSeparatorItem | IMessageListMessageItem

export type MessageVirtualListItemType =
  | IMessageListLoadOlderItem
  | IMessageListDateSeparatorItem
  | IMessageVirtualListMessageItem

export interface IMessageVirtualListItem {
  item: MessageVirtualListItemType
  virtualItem: VirtualItem
}
