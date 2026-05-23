import {
  type EventGetRooms,
  type EventChatRoomDeleted,
  type EventChatRoomLeft,
  type EventPinnedChatRoomsUpdated,
  isAvatarIdFor
} from 'global-shared'
import compact from 'lodash/compact'
import { useRoute, useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useMedia } from 'src/entities/media-file'
import { useMessage } from 'src/entities/message'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useChatRoomPinnedOrder } from 'src/features/chat-room-pinning'

import { filterRoomPreviewMessage } from '../lib/filter-room-preview-message'

export const useChatRoomSync = () => {
  const route = useRoute()
  const router = useRouter()
  const { chatRooms, getById, merge, put, remove } = useChatRoom()
  const { remove: removeMedia } = useMedia()
  const { bulkDelete, bulkPut } = useMessage()
  const { updatePinnedOrder } = useChatRoomPinnedOrder()

  const saveRoomPreviewMessages = async (rooms: EventGetRooms) => {
    await bulkPut(compact(rooms.map((room) => room.previewMessage)))
  }

  const actualizeChatRooms = async (rooms: EventGetRooms) => {
    const incomingRoomIds = new Set(rooms.map(({ id }) => id))
    const removedChatAvatarIds = compact(
      chatRooms.value
        .filter(({ id }) => !incomingRoomIds.has(id))
        .map(({ avatarId, id }) => isAvatarIdFor(avatarId, id) && avatarId)
    )

    await saveRoomPreviewMessages(rooms)
    await merge(rooms.map(filterRoomPreviewMessage))
    await Promise.all(removedChatAvatarIds.map(removeMedia))
  }

  const addChatRoom = async (room: EventGetRooms[number]) => {
    await saveRoomPreviewMessages([room])
    await put(filterRoomPreviewMessage(room))
  }

  const updatePinnedChatRooms = async ({ pinnedChatRoomIds }: EventPinnedChatRoomsUpdated) => {
    await updatePinnedOrder(pinnedChatRoomIds)
  }

  const removeChatRoom = async ({ roomId }: EventChatRoomDeleted | EventChatRoomLeft) => {
    const room = getById(roomId)

    if (!room) {
      await remove(roomId)

      if (route.params.chatRoomId === roomId) {
        await router.push(APP_PAGE_ROUTES.chatRooms)
      }

      return
    }

    const messageIds = room.messages
    const avatarId = room.avatarId

    await Promise.all([
      remove(roomId),
      bulkDelete(messageIds),
      isAvatarIdFor(avatarId, roomId) && removeMedia(avatarId)
    ])

    if (route.params.chatRoomId === roomId) {
      await router.push(APP_PAGE_ROUTES.chatRooms)
    }
  }

  const updateChatRoomData = async (room: EventGetRooms[number]) => {
    await saveRoomPreviewMessages([room])
    await put(filterRoomPreviewMessage(room))
  }

  return {
    actualizeChatRooms,
    addChatRoom,
    updateChatRoomData,
    updatePinnedChatRooms,
    removeChatRoom
  }
}
