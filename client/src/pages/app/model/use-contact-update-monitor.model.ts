import { useContactInvitationReceiver } from 'src/features/contact-invitation-notification'
import { registerSocketEventListeners } from 'src/shared/api'

import { useContactSync } from './use-contact-sync.model'

export const useContactUpdateMonitor = () => {
  const { processInviteReceived } = useContactInvitationReceiver()
  const {
    actualizeContacts,
    addContact,
    deleteContact,
    syncKnownUsers,
    updateContactData,
    updateContactInteractionType,
    updateContactTypingStatus,
    updateStatus
  } = useContactSync()
  let disposeContactUpdateMonitorListeners: (() => void) | null = null

  const initializeContactUpdateMonitor = () => {
    disposeContactUpdateMonitorListeners = registerSocketEventListeners([
      ['actual-contacts', actualizeContacts],
      ['known-users-updated', syncKnownUsers],
      ['contact-delete-success', deleteContact],
      ['contact-add-success', addContact],
      ['contact-status-updated', updateStatus],
      ['contact-data-changed', updateContactData],
      ['contact-interaction-updated', updateContactInteractionType],
      ['invite-received', processInviteReceived],
      ['get-contact-typing-status', updateContactTypingStatus]
    ])
  }

  const disposeContactUpdateMonitor = () => {
    disposeContactUpdateMonitorListeners?.()
    disposeContactUpdateMonitorListeners = null
  }

  return {
    initializeContactUpdateMonitor,
    disposeContactUpdateMonitor
  }
}
