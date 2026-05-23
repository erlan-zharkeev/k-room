import { useSocketEventListeners } from 'src/shared/api'

import { useChatRoomSync } from './use-chat-room-sync.model'

export const useChatRoomUpdateMonitor = () => {
  const { actualizeChatRooms, addChatRoom, removeChatRoom, updateChatRoomData, updatePinnedChatRooms } =
    useChatRoomSync()
  const { initializeSocketEventListeners, disposeSocketEventListeners } = useSocketEventListeners([
    { action: 'actual-chat-rooms', handler: actualizeChatRooms },
    { action: 'new-room-added', handler: addChatRoom },
    { action: 'room-data-updated', handler: updateChatRoomData },
    { action: 'pinned-chat-rooms-updated', handler: updatePinnedChatRooms },
    { action: 'chat-room-deleted', handler: removeChatRoom },
    { action: 'chat-room-left', handler: removeChatRoom }
  ])

  return {
    initializeChatRoomUpdateMonitor: initializeSocketEventListeners,
    disposeChatRoomUpdateMonitor: disposeSocketEventListeners
  }
}
