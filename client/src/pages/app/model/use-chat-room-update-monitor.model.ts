import type { SocketActions } from 'global-shared'
import { onBeforeUnmount } from 'vue'

import { socket } from 'src/shared/api'

import { useChatRoomSync } from './use-chat-room-sync.model'

export const useChatRoomUpdateMonitor = () => {
  const { actualizeChatRooms, addChatRoom, removeChatRoom, updateChatRoomData, updatePinnedChatRooms } =
    useChatRoomSync()

  const initializeChatRoomUpdateMonitor = () => {
    socket.on<SocketActions>('actual-chat-rooms', actualizeChatRooms)
    socket.on<SocketActions>('new-room-added', addChatRoom)
    socket.on<SocketActions>('room-data-updated', updateChatRoomData)
    socket.on<SocketActions>('pinned-chat-rooms-updated', updatePinnedChatRooms)
    socket.on<SocketActions>('chat-room-deleted', removeChatRoom)
    socket.on<SocketActions>('chat-room-left', removeChatRoom)
  }

  const disposeChatRoomUpdateMonitor = () => {
    socket.off<SocketActions>('actual-chat-rooms', actualizeChatRooms)
    socket.off<SocketActions>('new-room-added', addChatRoom)
    socket.off<SocketActions>('room-data-updated', updateChatRoomData)
    socket.off<SocketActions>('pinned-chat-rooms-updated', updatePinnedChatRooms)
    socket.off<SocketActions>('chat-room-deleted', removeChatRoom)
    socket.off<SocketActions>('chat-room-left', removeChatRoom)
  }

  onBeforeUnmount(disposeChatRoomUpdateMonitor)

  return {
    initializeChatRoomUpdateMonitor,
    disposeChatRoomUpdateMonitor
  }
}
