import type { SocketActions } from 'global-shared'
import { onBeforeUnmount } from 'vue'

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
    socket.on<SocketActions>('actual-contacts', actualizeContacts)
    socket.on<SocketActions>('known-users-updated', syncKnownUsers)
    socket.on<SocketActions>('contact-delete-success', deleteContact)
    socket.on<SocketActions>('contact-add-success', addContact)
    socket.on<SocketActions>('contact-status-updated', updateStatus)
    socket.on<SocketActions>('contact-data-changed', updateContactData)
    socket.on<SocketActions>('contact-interaction-updated', updateContactInteractionType)
    socket.on<SocketActions>('invite-received', processInvitation)
    socket.on<SocketActions>('get-contact-typing-status', updateContactTypingStatus)
  }

  const disposeContactUpdateMonitor = () => {
    socket.off<SocketActions>('actual-contacts', actualizeContacts)
    socket.off<SocketActions>('known-users-updated', syncKnownUsers)
    socket.off<SocketActions>('contact-delete-success', deleteContact)
    socket.off<SocketActions>('contact-add-success', addContact)
    socket.off<SocketActions>('contact-status-updated', updateStatus)
    socket.off<SocketActions>('contact-data-changed', updateContactData)
    socket.off<SocketActions>('contact-interaction-updated', updateContactInteractionType)
    socket.off<SocketActions>('invite-received', processInvitation)
    socket.off<SocketActions>('get-contact-typing-status', updateContactTypingStatus)
  }

  onBeforeUnmount(disposeContactUpdateMonitor)

  return {
    initializeContactUpdateMonitor,
    disposeContactUpdateMonitor
  }
}
