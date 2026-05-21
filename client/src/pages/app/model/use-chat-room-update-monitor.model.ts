import type { SocketActionsType } from 'global-shared'
import { onBeforeUnmount } from 'vue'

import { socket } from 'src/shared/api'

import { useChatRoomSync } from './use-chat-room-sync.model'

export const useChatRoomUpdateMonitor = () => {
  const { actualizeChatRooms, addChatRoom, removeChatRoom, updateChatRoomData, updatePinnedChatRooms } =
    useChatRoomSync()

  const initializeChatRoomUpdateMonitor = () => {
    socket.on<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
    socket.on<SocketActionsType>('new-room-added', addChatRoom)
    socket.on<SocketActionsType>('room-data-updated', updateChatRoomData)
    socket.on<SocketActionsType>('pinned-chat-rooms-updated', updatePinnedChatRooms)
    socket.on<SocketActionsType>('chat-room-deleted', removeChatRoom)
    socket.on<SocketActionsType>('chat-room-left', removeChatRoom)
  }

  const disposeChatRoomUpdateMonitor = () => {
    socket.off<SocketActionsType>('actual-chat-rooms', actualizeChatRooms)
    socket.off<SocketActionsType>('new-room-added', addChatRoom)
    socket.off<SocketActionsType>('room-data-updated', updateChatRoomData)
    socket.off<SocketActionsType>('pinned-chat-rooms-updated', updatePinnedChatRooms)
    socket.off<SocketActionsType>('chat-room-deleted', removeChatRoom)
    socket.off<SocketActionsType>('chat-room-left', removeChatRoom)
  }

  onBeforeUnmount(disposeChatRoomUpdateMonitor)

  return {
    initializeChatRoomUpdateMonitor,
    disposeChatRoomUpdateMonitor
  }
}
