import type { EventGetRoomsType, IEventPinnedChatRoomsUpdated, SocketActionsType } from 'global-shared'
import { onBeforeUnmount } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useChatRoomPinnedOrder } from 'src/features/chat-room-pinning'
import { socket } from 'src/shared/api'

import { filterRoomPreviewMessage } from '../lib/filter-room-preview-message'

import type { IEventUpdateChatRoomWithId } from './types.model'

export const useChatRoomUpdateMonitor = () => {
  const { getById, merge, put } = useChatRoom()
  const { bulkPut } = useMessage()
  const { updatePinnedOrder } = useChatRoomPinnedOrder()

  const saveRoomPreviewMessages = async (rooms: EventGetRoomsType) => {
    await bulkPut(rooms.flatMap((room) => (room.previewMessage ? [room.previewMessage] : [])))
  }

  const actualizeChatRooms = async (rooms: EventGetRoomsType) => {
    await saveRoomPreviewMessages(rooms)
    await merge(rooms.map(filterRoomPreviewMessage))
  }

  const handleRoomAddition = async (room: EventGetRoomsType[number]) => {
    await saveRoomPreviewMessages([room])
    await put(filterRoomPreviewMessage(room))
  }

  const handlePinnedChatRoomsUpdate = async ({ pinnedChatRoomIds }: IEventPinnedChatRoomsUpdated) => {
    await updatePinnedOrder(pinnedChatRoomIds)
  }

  const handleRoomDataUpdate = async (room: IEventUpdateChatRoomWithId) => {
    if (!room.id) return

    const currentRoom = getById(room.id)

    await put({
      id: room.id,
      authorId: room.users[0] ?? '',
      chatName: room.chatName,
      chatKind: room.chatKind,
      avatarId: room.avatar,
      lastMessageId: null,
      unreadMessagesQuantity: 0,
      isPinned: currentRoom?.isPinned ?? false,
      pinnedOrder: currentRoom?.pinnedOrder ?? null,
      users: room.users,
      messages: []
    })
  }

  const initializeChatRoomUpdateMonitor = () => {
    socket.on<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
    socket.on<SocketActionsType>('new-room-added', handleRoomAddition)
    socket.on<SocketActionsType>('room-data-updated', handleRoomDataUpdate)
    socket.on<SocketActionsType>('pinned-chat-rooms-updated', handlePinnedChatRoomsUpdate)
  }

  const disposeChatRoomUpdateMonitor = () => {
    socket.off<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
    socket.off<SocketActionsType>('new-room-added', handleRoomAddition)
    socket.off<SocketActionsType>('room-data-updated', handleRoomDataUpdate)
    socket.off<SocketActionsType>('pinned-chat-rooms-updated', handlePinnedChatRoomsUpdate)
  }

  onBeforeUnmount(disposeChatRoomUpdateMonitor)

  return {
    initializeChatRoomUpdateMonitor,
    disposeChatRoomUpdateMonitor
  }
}
