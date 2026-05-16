import type { EventGetRoomsType, SocketActionsType } from 'global-shared'
import { onBeforeUnmount } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { socket } from 'src/shared/api'

import type { IEventUpdateChatRoomWithId } from './types.model'

export const useChatRoomUpdateMonitor = () => {
  const { merge, put } = useChatRoom()

  const actualizeChatRooms = async (rooms: EventGetRoomsType) => {
    await merge(rooms)
  }

  const handleRoomAddition = async (room: EventGetRoomsType[number]) => {
    await put(room)
  }

  const handleRoomDataUpdate = async (room: IEventUpdateChatRoomWithId) => {
    if (!room.id) return

    await put({
      id: room.id,
      authorId: room.users[0] ?? '',
      chatName: room.chatName,
      chatKind: room.chatKind,
      avatarId: room.avatar,
      lastMessageId: null,
      unreadMessagesQuantity: 0,
      users: room.users,
      messages: []
    })
  }

  const initializeChatRoomUpdateMonitor = () => {
    socket.on<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
    socket.on<SocketActionsType>('new-room-added', handleRoomAddition)
    socket.on<SocketActionsType>('room-data-updated', handleRoomDataUpdate)
  }

  const disposeChatRoomUpdateMonitor = () => {
    socket.off<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
    socket.off<SocketActionsType>('new-room-added', handleRoomAddition)
    socket.off<SocketActionsType>('room-data-updated', handleRoomDataUpdate)
  }

  onBeforeUnmount(disposeChatRoomUpdateMonitor)

  return {
    initializeChatRoomUpdateMonitor,
    disposeChatRoomUpdateMonitor
  }
}
