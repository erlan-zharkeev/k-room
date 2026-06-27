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
import { useSettings } from 'src/entities/setting'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { usePinChatRoomOrder } from 'src/features/pin-chat-room'

import { filterRoomPayloadMessages } from '../lib/filter-room-payload-messages'

export const useChatRoomSync = () => {
  const route = useRoute()
  const router = useRouter()
  const { bulkUpdate, chatRooms, getById, merge, put, remove } = useChatRoom()
  const { syncWithOptions } = useSyncMedia()
  const { bulkDelete, bulkPut } = useMessage()
  const { settings, shallowUpdate } = useSettings()
  const { updatePinnedChatRoomOrder } = usePinChatRoomOrder()

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
    await updatePinnedChatRoomOrder(pinnedChatRoomIds)
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
    const clearSavedRoomId = async () => {
      if (settings.value.chatRoomId === roomId) {
        await shallowUpdate({ chatRoomId: '' })
      }
    }

    if (!room) {
      await Promise.all([remove(roomId), clearSavedRoomId()])

      if (route.params.chatRoomId === roomId) {
        await router.push(APP_PAGE_ROUTES.chatRooms)
      }

      return
    }

    const { messages: messageIds } = room

    await Promise.all([remove(roomId), bulkDelete(messageIds), clearSavedRoomId()])

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
