import {
  type EventGetRooms,
  type EventChatRoomDeleted,
  type EventChatRoomLeft,
  type EventMutedChatRoomsUpdated,
  type EventPinnedChatRoomsUpdated
} from 'global-shared'
import compact from 'lodash/compact'
import { useRoute, useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useSyncMedia } from 'src/entities/media-file'
import { useMessage } from 'src/entities/message'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useChatRoomPinnedOrder } from 'src/features/chat-room-pinning'

import { filterRoomPayloadMessages } from '../lib/filter-room-payload-messages'

export const useChatRoomSync = () => {
  const route = useRoute()
  const router = useRouter()
  const { bulkUpdate, chatRooms, getById, merge, put, remove } = useChatRoom()
  const { syncWithOptions } = useSyncMedia()
  const { bulkDelete, bulkPut } = useMessage()
  const { updatePinnedOrder } = useChatRoomPinnedOrder()

  const saveRoomPayloadMessages = async (rooms: EventGetRooms) => {
    await bulkPut(compact(rooms.flatMap((room) => [room.previewMessage, room.pinnedMessage])))
  }

  const actualizeChatRooms = async (rooms: EventGetRooms) => {
    await saveRoomPayloadMessages(rooms)
    await merge(rooms.map(filterRoomPayloadMessages))
  }

  const addChatRoom = async (room: EventGetRooms[number]) => {
    await saveRoomPayloadMessages([room])
    await put(filterRoomPayloadMessages(room))
  }

  const updatePinnedChatRooms = async ({ pinnedChatRoomIds }: EventPinnedChatRoomsUpdated) => {
    await updatePinnedOrder(pinnedChatRoomIds)
  }

  const updateMutedChatRooms = async ({ mutedChatRoomIds }: EventMutedChatRoomsUpdated) => {
    await bulkUpdate(
      chatRooms.value.map(({ id }) => ({
        id,
        changes: {
          isMuted: mutedChatRoomIds.includes(id)
        }
      }))
    )
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

    const { messages: messageIds } = room

    await Promise.all([remove(roomId), bulkDelete(messageIds)])

    if (route.params.chatRoomId === roomId) {
      await router.push(APP_PAGE_ROUTES.chatRooms)
    }
  }

  const updateChatRoomData = async (room: EventGetRooms[number]) => {
    await saveRoomPayloadMessages([room])

    if (room.avatarId) {
      syncWithOptions(room.avatarId, { force: true })
    }

    await put(filterRoomPayloadMessages(room))
  }

  return {
    actualizeChatRooms,
    addChatRoom,
    updateChatRoomData,
    updateMutedChatRooms,
    updatePinnedChatRooms,
    removeChatRoom
  }
}
