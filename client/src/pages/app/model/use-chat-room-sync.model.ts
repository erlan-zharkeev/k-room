import {
  MEDIA_AVATAR_FILENAME_PREFIX,
  type EventGetRoomsType,
  type IEventChatRoomDeleted,
  type IEventChatRoomLeft,
  type IEventPinnedChatRoomsUpdated
} from 'global-shared'
import { useRoute, useRouter } from 'vue-router'

import { useChatRoom } from 'src/entities/chat-room'
import { useDeleteMedia } from 'src/entities/media-file'
import { useMessage } from 'src/entities/message'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { useChatRoomPinnedOrder } from 'src/features/chat-room-pinning'

import { filterRoomPreviewMessage } from '../lib/filter-room-preview-message'

export const useChatRoomSync = () => {
  const route = useRoute()
  const router = useRouter()
  const { chatRooms, getById, merge, put, remove } = useChatRoom()
  const { deleteMedia } = useDeleteMedia()
  const { bulkDelete, bulkPut } = useMessage()
  const { updatePinnedOrder } = useChatRoomPinnedOrder()

  const saveRoomPreviewMessages = async (rooms: EventGetRoomsType) => {
    await bulkPut(rooms.flatMap((room) => (room.previewMessage ? [room.previewMessage] : [])))
  }

  const actualizeChatRooms = async (rooms: EventGetRoomsType) => {
    const incomingRoomIds = new Set(rooms.map(({ id }) => id))
    const removedChatAvatarIds = chatRooms.value
      .filter(({ id }) => !incomingRoomIds.has(id))
      .flatMap(({ avatarId, id }) => (avatarId === `${MEDIA_AVATAR_FILENAME_PREFIX}${id}` ? [avatarId] : []))

    await saveRoomPreviewMessages(rooms)
    await merge(rooms.map(filterRoomPreviewMessage))
    await Promise.all(removedChatAvatarIds.map(deleteMedia))
  }

  const addChatRoom = async (room: EventGetRoomsType[number]) => {
    await saveRoomPreviewMessages([room])
    await put(filterRoomPreviewMessage(room))
  }

  const updatePinnedChatRooms = async ({ pinnedChatRoomIds }: IEventPinnedChatRoomsUpdated) => {
    await updatePinnedOrder(pinnedChatRoomIds)
  }

  const removeChatRoom = async ({ roomId }: IEventChatRoomDeleted | IEventChatRoomLeft) => {
    const room = getById(roomId)
    const messageIds = room?.messages ?? []
    const avatarId = room?.avatarId

    await Promise.all([
      remove(roomId),
      bulkDelete(messageIds),
      avatarId === `${MEDIA_AVATAR_FILENAME_PREFIX}${roomId}` && deleteMedia(avatarId)
    ])

    if (route.params.chatRoomId === roomId) {
      await router.push(APP_PAGE_ROUTES.chatRooms)
    }
  }

  const updateChatRoomData = async (room: EventGetRoomsType[number]) => {
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
