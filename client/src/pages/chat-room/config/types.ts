import type { RouteLocationRaw } from 'vue-router'

import type { FChatRoomType } from 'src/shared/lib'
import type { DbMessageType } from 'src/shared/lib'

export interface IChatRoomNavigationItem {
  id: string
  to: RouteLocationRaw
  title: string
  description: string
  imageId: string
  avatarShape: 'square' | 'circle'
  online: boolean
  selected: boolean
  lastMessageCreatedAt: number
  unreadMessagesQuantity: number
}

export interface IChatRoomContactPickerItem {
  id: string
  title: string
  imageId: string
  selected: boolean
}

export interface IChatRoomListProps {
  items: IChatRoomNavigationItem[]
}

export interface IChatRoomListItemProps {
  item: IChatRoomNavigationItem
}

export interface IChatRoomMessagesProps {
  room: FChatRoomType
}

export interface IMessageBodyProps {
  isPrivateRoom: boolean
  message: DbMessageType
}

export interface IDateSeparatorProps {
  label: string
}

export type MessageListItemType =
  | {
      type: 'date-separator'
      id: string
      label: string
    }
  | {
      type: 'message'
      id: string
      message: DbMessageType
    }
