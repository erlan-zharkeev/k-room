import { registerSocketEventListeners } from 'src/shared/api'

import { useContactSync } from './use-contact-sync.model'

export const useContactUpdateMonitor = () => {
  const {
    actualizeContacts,
    addContact,
    deleteContact,
    processInvitation,
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
      ['invite-received', processInvitation],
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
