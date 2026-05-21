import type { IEventUpdatePinnedChatRoomOrder, SocketActionsType } from 'global-shared'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getRoomDisplayedLastMessageId, isRoomPrivate, useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMessage } from 'src/entities/message'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useChatRoomPinnedOrder } from 'src/features/chat-room-pinning'
import { socket, useSocketAction } from 'src/shared/api'
import { useScreen } from 'src/shared/lib'

import type { IChatRoomNavigationItem } from '../config/types'

const searchQuery = ref('')

export const useChatRoomsList = () => {
  const router = useRouter()
  const route = useRoute()
  const { isPortraitTabletOrLess } = useScreen()
  const { chatRooms } = useChatRoom()
  const { contacts } = useContact()
  const { getById } = useMessage()
  const { emitSocketAction } = useSocketAction()
  const { updatePinnedOrder } = useChatRoomPinnedOrder()

  const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())

  const getRoomFallbackActivityAt = (roomId: string) => {
    const objectIdTimestamp = roomId.slice(0, 8)

    if (!/^[\da-f]{8}$/i.test(objectIdTimestamp)) return 0

    return Number.parseInt(objectIdTimestamp, 16) * 1000
  }

  const buildChatRoomRoute = (roomId: string) => {
    const query = isPortraitTabletOrLess.value ? { ...route.query, view: 'content' } : route.query

    return {
      path: `${APP_PAGE_ROUTES.chatRooms}/${roomId}`,
      query
    }
  }

  const chatRoomList = computed<IChatRoomNavigationItem[]>(() => {
    const items = chatRooms.value.map((room) => {
      const privateRoom = isRoomPrivate(room)
      const privateContact = privateRoom ? contacts.value.find(({ id }) => id === room.users[0]) : undefined
      const displayedLastMessageId = getRoomDisplayedLastMessageId(room)
      const lastMessage = displayedLastMessageId ? getById(displayedLastMessageId) : undefined
      const title = room.chatName || privateContact?.nickname || ''

      return {
        id: room.id,
        adminId: room.adminId,
        chatKind: room.chatKind,
        to: buildChatRoomRoute(room.id),
        title,
        description: lastMessage?.body ?? '',
        imageId: room.avatarId,
        online: Boolean(privateContact?.online),
        selected: route.params.chatRoomId === room.id,
        lastMessageCreatedAt: lastMessage?.createdAt ?? getRoomFallbackActivityAt(room.id),
        unreadMessagesQuantity: room.unreadMessagesQuantity ?? 0,
        isPinned: room.isPinned,
        pinnedOrder: room.pinnedOrder
      }
    })

    const filteredItems = normalizedSearchQuery.value
      ? items.filter(({ title }) => title.toLowerCase().includes(normalizedSearchQuery.value))
      : items

    return filteredItems.sort((current, next) => {
      if (current.isPinned && next.isPinned) {
        return (current.pinnedOrder ?? 0) - (next.pinnedOrder ?? 0)
      }

      if (current.isPinned !== next.isPinned) {
        return current.isPinned ? -1 : 1
      }

      return next.lastMessageCreatedAt - current.lastMessageCreatedAt
    })
  })

  const showNoSearchResults = computed(() => Boolean(normalizedSearchQuery.value) && chatRoomList.value.length === 0)
  const showNoChats = computed(() => !normalizedSearchQuery.value && chatRooms.value.length === 0)

  const openChatRoom = (roomId: string) => {
    router.push(buildChatRoomRoute(roomId))
  }

  const reorderPinnedChatRooms = async (items: IChatRoomNavigationItem[]) => {
    const pinnedChatRoomIds = items.map(({ id }) => id)

    await updatePinnedOrder(pinnedChatRoomIds)
    void emitSocketAction<IEventUpdatePinnedChatRoomOrder>(
      'update-pinned-chat-room-order',
      { pinnedChatRoomIds },
      {
        onFailure: () => {
          socket.emit<SocketActionsType>('actualize-user-data')
        }
      }
    )
  }

  return {
    searchQuery,
    chatRoomList,
    showNoSearchResults,
    showNoChats,
    openChatRoom,
    reorderPinnedChatRooms
  }
}
