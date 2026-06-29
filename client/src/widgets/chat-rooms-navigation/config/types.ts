import type { ChatRoom, MediaId } from 'global-shared'
import type { RouteLocationRaw } from 'vue-router'

export type ChatRoomNavigationItem = Pick<
  ChatRoom,
  'adminId' | 'chatKind' | 'id' | 'isMuted' | 'isPinned' | 'pinnedOrder' | 'unreadMessagesQuantity'
> & {
  to: RouteLocationRaw
  title: string
  description: string
  imageId: MediaId
  isFavoritesRoom: boolean
  isSupportRoom: boolean
  online: boolean
  selected: boolean
  lastMessageCreatedAt: number
}

export interface ChatRoomListItemProps {
  item: ChatRoomNavigationItem
}
