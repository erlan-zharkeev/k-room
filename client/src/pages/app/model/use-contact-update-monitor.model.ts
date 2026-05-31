import { socket } from 'src/shared/api'

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

  const initializeContactUpdateMonitor = () => {
    socket.on('actual-contacts', actualizeContacts)
    socket.on('known-users-updated', syncKnownUsers)
    socket.on('contact-delete-success', deleteContact)
    socket.on('contact-add-success', addContact)
    socket.on('contact-status-updated', updateStatus)
    socket.on('contact-data-changed', updateContactData)
    socket.on('contact-interaction-updated', updateContactInteractionType)
    socket.on('invite-received', processInvitation)
    socket.on('get-contact-typing-status', updateContactTypingStatus)
  }

  const disposeContactUpdateMonitor = () => {
    socket.off('actual-contacts', actualizeContacts)
    socket.off('known-users-updated', syncKnownUsers)
    socket.off('contact-delete-success', deleteContact)
    socket.off('contact-add-success', addContact)
    socket.off('contact-status-updated', updateStatus)
    socket.off('contact-data-changed', updateContactData)
    socket.off('contact-interaction-updated', updateContactInteractionType)
    socket.off('invite-received', processInvitation)
    socket.off('get-contact-typing-status', updateContactTypingStatus)
  }

  return {
    initializeContactUpdateMonitor,
    disposeContactUpdateMonitor
  }
}
