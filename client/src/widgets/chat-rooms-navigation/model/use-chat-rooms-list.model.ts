import type { EventUpdatePinnedChatRoomOrder, SocketActions } from 'global-shared'
import partition from 'lodash/partition'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getRoomDisplayedLastMessageId, useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useChatRoomPinnedOrder } from 'src/features/chat-room-pinning'
import { socket, useSocketAction } from 'src/shared/api'
import { useI18n, useScreen } from 'src/shared/lib'

import { CHAT_ROOMS_NAVIGATION_I18N } from '../config/i18n'
import type { ChatRoomNavigationItem } from '../config/types'
import { resolveLastMessageDescription } from '../lib/resolve-last-message-description'

import { useChatRoomContactLookup } from './use-chat-room-contact-lookup.model'

const searchQuery = ref('')

export const useChatRoomsList = () => {
  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()
  const { isPortraitTabletOrLess } = useScreen()
  const { chatRooms } = useChatRoom()
  const { getChatRoomPrivateContact } = useChatRoomContactLookup()
  const { getById } = useMessage()
  const { emitSocketAction } = useSocketAction()
  const { updatePinnedOrder } = useChatRoomPinnedOrder()

  const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())

  const buildChatRoomRoute = (roomId: string) => {
    const query = isPortraitTabletOrLess.value ? { ...route.query, view: 'content' } : route.query

    return {
      path: `${APP_PAGE_ROUTES.chatRooms}/${roomId}`,
      query
    }
  }

  const chatRoomList = computed<ChatRoomNavigationItem[]>(() => {
    const items = chatRooms.value.map((room) => {
      const {
        id,
        adminId,
        chatKind,
        chatName,
        avatarId,
        createdAt,
        unreadMessagesQuantity,
        isPinned,
        pinnedOrder,
        isMuted
      } = room
      const privateContact = getChatRoomPrivateContact(room)
      const displayedLastMessageId = getRoomDisplayedLastMessageId(room)
      const lastMessage = displayedLastMessageId ? getById(displayedLastMessageId) : undefined
      const title = chatName || privateContact?.nickname || ''
      const description = resolveLastMessageDescription(
        lastMessage,
        t(CHAT_ROOMS_NAVIGATION_I18N.imageMessage),
        t(CHAT_ROOMS_NAVIGATION_I18N.replyMessage),
        t(CHAT_ROOMS_NAVIGATION_I18N.forwardMessage)
      )

      return {
        id,
        adminId,
        chatKind,
        to: buildChatRoomRoute(id),
        title,
        description,
        imageId: avatarId,
        online: Boolean(privateContact?.online),
        selected: route.params.chatRoomId === id,
        lastMessageCreatedAt: lastMessage?.createdAt ?? createdAt,
        unreadMessagesQuantity: unreadMessagesQuantity ?? 0,
        isPinned,
        pinnedOrder,
        isMuted
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

  const chatRoomListGroups = computed(() => {
    const [pinnedChatRoomList, regularChatRoomList] = partition(chatRoomList.value, ({ isPinned }) => isPinned)

    return {
      pinnedChatRoomList,
      regularChatRoomList
    }
  })
  const showNoSearchResults = computed(() => Boolean(normalizedSearchQuery.value) && chatRoomList.value.length === 0)
  const showNoChats = computed(() => !normalizedSearchQuery.value && chatRooms.value.length === 0)
  const canReorderPinnedChatRooms = computed(
    () => !searchQuery.value.trim() && chatRoomListGroups.value.pinnedChatRoomList.length > 1
  )

  const openChatRoom = (roomId: string) => {
    router.push(buildChatRoomRoute(roomId))
  }

  const reorderPinnedChatRooms = async (items: ChatRoomNavigationItem[]) => {
    const pinnedChatRoomIds = items.map(({ id }) => id)

    await updatePinnedOrder(pinnedChatRoomIds)
    void emitSocketAction<EventUpdatePinnedChatRoomOrder>(
      'update-pinned-chat-room-order',
      { pinnedChatRoomIds },
      {
        onFailure: () => {
          socket.emit<SocketActions>('actualize-user-data')
        }
      }
    )
  }

  return {
    searchQuery,
    chatRoomList,
    chatRoomListGroups,
    showNoSearchResults,
    showNoChats,
    canReorderPinnedChatRooms,
    openChatRoom,
    reorderPinnedChatRooms
  }
}
