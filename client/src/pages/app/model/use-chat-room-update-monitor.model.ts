import type { EventGetRoomsType, SocketActionsType } from 'global-shared'
import { onBeforeUnmount } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { socket } from 'src/shared/api'

import { filterRoomPreviewMessage } from '../lib/filter-room-preview-message'

import type { IEventUpdateChatRoomWithId } from './types.model'

export const useChatRoomUpdateMonitor = () => {
  const { merge, put } = useChatRoom()
  const { bulkPut } = useMessage()

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
