import { getAppChatRoomPath } from 'global-shared'
import partition from 'lodash/partition'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  CHAT_ROOM_I18N,
  getRoomDisplayedLastMessageId,
  isRoomFavorites,
  isRoomSupport,
  useChatRoom
} from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { usePinChatRoomOrder } from 'src/features/pin-chat-room'
import { socket, useSocketAction, useSocketAvailability } from 'src/shared/api'
import { useI18n, useScreen } from 'src/shared/lib'

import type { ChatRoomNavigationItem } from '../config/types'
import { resolveLastMessageDescription } from '../lib/resolve-last-message-description'

import { useChatRoomContactLookup } from './use-chat-room-contact-lookup.model'

const searchQuery = ref('')

export const useChatRoomsList = () => {
  const router = useRouter()
  const route = useRoute()
  const { isPortraitTabletOrLess } = useScreen()
  const { t } = useI18n()
  const { chatRooms } = useChatRoom()
  const { getChatRoomPrivateContact, getChatRoomSupportContact } = useChatRoomContactLookup()
  const { getById } = useMessage()
  const { emitSocketAction } = useSocketAction()
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
  const { updatePinnedChatRoomOrder } = usePinChatRoomOrder()

  const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())

  const buildChatRoomRoute = (roomId: string) => {
    const query = isPortraitTabletOrLess.value ? { ...route.query, view: 'content' } : route.query

    return {
      path: getAppChatRoomPath(roomId),
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
      const supportContact = getChatRoomSupportContact(room)
      const displayedLastMessageId = getRoomDisplayedLastMessageId(room)
      const lastMessage = displayedLastMessageId ? getById(displayedLastMessageId) : undefined
      const isFavoritesRoom = isRoomFavorites(room)
      const isSupportRoom = isRoomSupport(room)
      const title = isSupportRoom
        ? supportContact?.nickname || t(CHAT_ROOM_I18N.supportTitle)
        : isFavoritesRoom
        ? t(CHAT_ROOM_I18N.favoritesTitle)
        : chatName || privateContact?.nickname || ''
      const description = resolveLastMessageDescription(lastMessage, t)

      return {
        id,
        adminId,
        chatKind,
        to: buildChatRoomRoute(id),
        title,
        description,
        imageId: avatarId,
        isFavoritesRoom,
        isSupportRoom,
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

    await updatePinnedChatRoomOrder(pinnedChatRoomIds)
    void emitSocketAction(
      'update-pinned-chat-room-order',
      { pinnedChatRoomIds },
      {
        onFailure: () => {
          if (!isSocketOnlineActionAvailable.value) return

          socket.emit('actualize-user-data')
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
