import type { ChatKind, MediaId } from 'global-shared'
import type { RouteLocationRaw } from 'vue-router'

export interface ChatRoomNavigationItem {
  id: string
  adminId: string
  chatKind: ChatKind
  to: RouteLocationRaw
  title: string
  description: string
  imageId: MediaId
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
