import { registerSocketEventListeners } from 'src/shared/api'

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
  let disposeMessageMonitorListeners: (() => void) | null = null

  const initializeMessageMonitor = () => {
    disposeMessageMonitorListeners = registerSocketEventListeners([
      ['message-deleted', handleMessageDeleted],
      ['message-delivered', handleDeliveredMessage],
      ['message-edited', handleMessageEdited],
      ['message-link-preview-updated', handleMessageLinkPreviewUpdated],
      ['message-reaction-updated', handleMessageReactionUpdate],
      ['pinned-message-updated', handlePinnedMessageUpdated],
      ['message-status-updated', updateMessageStatus],
      ['messages-status-updated', updateMessagesStatus]
    ])
  }

  const disposeMessageMonitor = () => {
    disposeMessageMonitorListeners?.()
    disposeMessageMonitorListeners = null
  }

  return {
    initializeMessageMonitor,
    disposeMessageMonitor
  }
}
