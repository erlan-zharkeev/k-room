import { socket } from 'src/shared/api'

import { useMessageSync } from './use-message-sync.model'

export const useMessageMonitor = () => {
  const {
    handleDeliveredMessage,
    handleMessageEdited,
    handleMessageLinkPreviewUpdated,
    handleMessageDeleted,
    handleMessageReactionUpdate,
    handlePinnedMessageUpdated,
    updateMessageStatus,
    updateMessagesStatus
  } = useMessageSync()

  const initializeMessageMonitor = () => {
    socket.on('message-deleted', handleMessageDeleted)
    socket.on('message-delivered', handleDeliveredMessage)
    socket.on('message-edited', handleMessageEdited)
    socket.on('message-link-preview-updated', handleMessageLinkPreviewUpdated)
    socket.on('message-reaction-updated', handleMessageReactionUpdate)
    socket.on('pinned-message-updated', handlePinnedMessageUpdated)
    socket.on('message-status-updated', updateMessageStatus)
    socket.on('messages-status-updated', updateMessagesStatus)
  }

  const disposeMessageMonitor = () => {
    socket.off('message-deleted', handleMessageDeleted)
    socket.off('message-delivered', handleDeliveredMessage)
    socket.off('message-edited', handleMessageEdited)
    socket.off('message-link-preview-updated', handleMessageLinkPreviewUpdated)
    socket.off('message-reaction-updated', handleMessageReactionUpdate)
    socket.off('pinned-message-updated', handlePinnedMessageUpdated)
    socket.off('message-status-updated', updateMessageStatus)
    socket.off('messages-status-updated', updateMessagesStatus)
  }

  return {
    initializeMessageMonitor,
    disposeMessageMonitor
  }
}
