import { updateRoomTypingStatus } from 'src/features/chat-room-typing'
import { registerSocketEventListeners } from 'src/shared/api'

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
  let disposeChatRoomUpdateMonitorListeners: (() => void) | null = null

  const initializeChatRoomUpdateMonitor = () => {
    disposeChatRoomUpdateMonitorListeners = registerSocketEventListeners([
      ['actual-chat-rooms', actualizeChatRooms],
      ['new-room-added', addChatRoom],
      ['room-data-updated', updateChatRoomData],
      ['muted-chat-rooms-updated', updateMutedChatRooms],
      ['pinned-chat-rooms-updated', updatePinnedChatRooms],
      ['chat-room-deleted', removeChatRoom],
      ['chat-room-left', removeChatRoom],
      ['room-typing-status', updateRoomTypingStatus]
    ])
  }

  const disposeChatRoomUpdateMonitor = () => {
    disposeChatRoomUpdateMonitorListeners?.()
    disposeChatRoomUpdateMonitorListeners = null
  }

  return {
    initializeChatRoomUpdateMonitor,
    disposeChatRoomUpdateMonitor
  }
}
