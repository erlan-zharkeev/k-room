import { updateRoomTypingStatus } from 'src/features/chat-room-typing'
import { socket } from 'src/shared/api'

import { useChatRoomSync } from './use-chat-room-sync.model'

export const useChatRoomUpdateMonitor = () => {
  const {
    actualizeChatRooms,
    addChatRoom,
    removeChatRoom,
    updateChatRoomData,
    updateMutedChatRooms,
    updatePinnedChatRooms
  } = useChatRoomSync()

  const initializeChatRoomUpdateMonitor = () => {
    socket.on('actual-chat-rooms', actualizeChatRooms)
    socket.on('new-room-added', addChatRoom)
    socket.on('room-data-updated', updateChatRoomData)
    socket.on('muted-chat-rooms-updated', updateMutedChatRooms)
    socket.on('pinned-chat-rooms-updated', updatePinnedChatRooms)
    socket.on('chat-room-deleted', removeChatRoom)
    socket.on('chat-room-left', removeChatRoom)
    socket.on('room-typing-status', updateRoomTypingStatus)
  }

  const disposeChatRoomUpdateMonitor = () => {
    socket.off('actual-chat-rooms', actualizeChatRooms)
    socket.off('new-room-added', addChatRoom)
    socket.off('room-data-updated', updateChatRoomData)
    socket.off('muted-chat-rooms-updated', updateMutedChatRooms)
    socket.off('pinned-chat-rooms-updated', updatePinnedChatRooms)
    socket.off('chat-room-deleted', removeChatRoom)
    socket.off('chat-room-left', removeChatRoom)
    socket.off('room-typing-status', updateRoomTypingStatus)
  }

  return {
    initializeChatRoomUpdateMonitor,
    disposeChatRoomUpdateMonitor
  }
}
