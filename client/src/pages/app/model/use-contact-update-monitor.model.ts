import type { SocketActionsType } from 'global-shared'
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
    socket.on<SocketActionsType>('actual-contacts', actualizeContacts)
    socket.on<SocketActionsType>('known-users-updated', syncKnownUsers)
    socket.on<SocketActionsType>('contact-delete-success', deleteContact)
    socket.on<SocketActionsType>('contact-add-success', addContact)
    socket.on<SocketActionsType>('contact-status-updated', updateStatus)
    socket.on<SocketActionsType>('contact-data-changed', updateContactData)
    socket.on<SocketActionsType>('contact-interaction-updated', updateContactInteractionType)
    socket.on<SocketActionsType>('invite-received', processInvitation)
    socket.on<SocketActionsType>('get-contact-typing-status', updateContactTypingStatus)
  }

  const disposeContactUpdateMonitor = () => {
    socket.off<SocketActionsType>('actual-contacts', actualizeContacts)
    socket.off<SocketActionsType>('known-users-updated', syncKnownUsers)
    socket.off<SocketActionsType>('contact-delete-success', deleteContact)
    socket.off<SocketActionsType>('contact-add-success', addContact)
    socket.off<SocketActionsType>('contact-status-updated', updateStatus)
    socket.off<SocketActionsType>('contact-data-changed', updateContactData)
    socket.off<SocketActionsType>('contact-interaction-updated', updateContactInteractionType)
    socket.off<SocketActionsType>('invite-received', processInvitation)
    socket.off<SocketActionsType>('get-contact-typing-status', updateContactTypingStatus)
  }

  onBeforeUnmount(disposeContactUpdateMonitor)

  return {
    initializeContactUpdateMonitor,
    disposeContactUpdateMonitor
  }
}
