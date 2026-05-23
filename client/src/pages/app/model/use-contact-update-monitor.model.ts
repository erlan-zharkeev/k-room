import { useSocketEventListeners } from 'src/shared/api'

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
  const { initializeSocketEventListeners, disposeSocketEventListeners } = useSocketEventListeners([
    { action: 'actual-contacts', handler: actualizeContacts },
    { action: 'known-users-updated', handler: syncKnownUsers },
    { action: 'contact-delete-success', handler: deleteContact },
    { action: 'contact-add-success', handler: addContact },
    { action: 'contact-status-updated', handler: updateStatus },
    { action: 'contact-data-changed', handler: updateContactData },
    { action: 'contact-interaction-updated', handler: updateContactInteractionType },
    { action: 'invite-received', handler: processInvitation },
    { action: 'get-contact-typing-status', handler: updateContactTypingStatus }
  ])

  return {
    initializeContactUpdateMonitor: initializeSocketEventListeners,
    disposeContactUpdateMonitor: disposeSocketEventListeners
  }
}
