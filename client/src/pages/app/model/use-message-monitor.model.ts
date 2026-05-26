import type { SocketActions } from 'global-shared'

import { socket } from 'src/shared/api'

import { useMessageSync } from './use-message-sync.model'

export const useMessageMonitor = () => {
  const {
    handleDeliveredMessage,
    handleMessageDeleted,
    handleMessageReactionUpdate,
    handlePinnedMessageUpdated,
    updateMessageStatus,
    updateMessagesStatus
  } = useMessageSync()

  const initializeMessageMonitor = () => {
    socket.on<SocketActions>('message-deleted', handleMessageDeleted)
    socket.on<SocketActions>('message-delivered', handleDeliveredMessage)
    socket.on<SocketActions>('message-reaction-updated', handleMessageReactionUpdate)
    socket.on<SocketActions>('pinned-message-updated', handlePinnedMessageUpdated)
    socket.on<SocketActions>('message-status-updated', updateMessageStatus)
    socket.on<SocketActions>('messages-status-updated', updateMessagesStatus)
  }

  const disposeMessageMonitor = () => {
    socket.off<SocketActions>('message-deleted', handleMessageDeleted)
    socket.off<SocketActions>('message-delivered', handleDeliveredMessage)
    socket.off<SocketActions>('message-reaction-updated', handleMessageReactionUpdate)
    socket.off<SocketActions>('pinned-message-updated', handlePinnedMessageUpdated)
    socket.off<SocketActions>('message-status-updated', updateMessageStatus)
    socket.off<SocketActions>('messages-status-updated', updateMessagesStatus)
  }

  return {
    initializeMessageMonitor,
    disposeMessageMonitor
  }
}
