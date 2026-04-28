import type {
  EventChangeContactsDataType,
  EventInviteReceivedType,
  IEventContactAddSuccess,
  IEventDeleteContactSuccess,
  IEventGetContactTypingStatus,
  IEventStatusContact,
  IEventUpdateContactInteractionSuccess,
  IFrontendContact,
  SocketActionsType
} from 'global-shared'
import { onBeforeUnmount } from 'vue'

import { getRequiredContactSystemData, useContact, useUpdateContactData } from 'src/entities/contact'
import { socket } from 'src/shared/api'

import { CONTACT_ONLINE_STATUS_TTL_MS, CONTACT_ONLINE_CHECK_INTERVAL_MS } from '../config/constants'

export const useContactUpdateMonitor = () => {
  const { bulkPut, contacts, get, mergeMany, put, remove } = useContact()
  const { updateContactData } = useUpdateContactData()
  let onlineCheckIntervalId: ReturnType<typeof setInterval> | undefined

  const actualizeContacts = async (nextContacts: IFrontendContact[]) => {
    await mergeMany(nextContacts, {
      merge: (current, incoming) => ({
        ...getRequiredContactSystemData(),
        ...current,
        ...incoming,
        onlineStatusSyncedAt: Date.now()
      }),
      removeMissing: true
    })
  }

  const deleteContact = async ({ deletedContactId }: IEventDeleteContactSuccess) => {
    await remove(deletedContactId)
  }

  const addContact = async ({ contactData }: IEventContactAddSuccess) => {
    await put({ ...contactData, ...getRequiredContactSystemData() })
  }

  const updateStatus = async ({
    interlocutorId,
    online,
    onlineStatusUpdatedTimestamp: onlineStatusUpdatedTimestampMs,
    lastSeen
  }: IEventStatusContact) => {
    await updateContactData(interlocutorId, {
      online,
      lastSeen,
      onlineStatusSyncedAt: onlineStatusUpdatedTimestampMs
    })
  }

  const updateContactDataHandler = async (payload: EventChangeContactsDataType) => {
    await updateContactData(payload.id, payload)
  }

  const updateContactInteractionType = async ({ contactId, interaction }: IEventUpdateContactInteractionSuccess) => {
    await updateContactData(contactId, { interactionType: interaction })
  }

  const processInvitation = async (payload: EventInviteReceivedType) => {
    const existingContact = await get(payload.id)

    await put({
      ...getRequiredContactSystemData(),
      ...existingContact,
      ...payload,
      onlineStatusSyncedAt: Date.now()
    })
  }

  const updateContactTypingStatus = async ({ contactId, isTyping }: IEventGetContactTypingStatus) => {
    await updateContactData(contactId, { isTyping })
  }

  const checkForContactOnline = () => {
    socket.emit<SocketActionsType>('interlocutor-ping')

    const currentTimestampMs = Date.now()

    contacts.value.forEach((contact) => {
      if (currentTimestampMs - contact.onlineStatusSyncedAt > CONTACT_ONLINE_STATUS_TTL_MS) {
        updateContactData(contact.id, { online: false })
      }
    })
  }

  const initializeContactUpdateMonitor = () => {
    socket.on<SocketActionsType>('actual-contacts', actualizeContacts)
    socket.on<SocketActionsType>('contacts-loaded', bulkPut)
    socket.on<SocketActionsType>('contact-delete-success', deleteContact)
    socket.on<SocketActionsType>('contact-add-success', addContact)
    socket.on<SocketActionsType>('contact-status-updated', updateStatus)
    socket.on<SocketActionsType>('contact-data-changed', updateContactDataHandler)
    socket.on<SocketActionsType>('contact-interaction-updated', updateContactInteractionType)
    socket.on<SocketActionsType>('invite-received', processInvitation)
    socket.on<SocketActionsType>('get-contact-typing-status', updateContactTypingStatus)

    onlineCheckIntervalId = setInterval(checkForContactOnline, CONTACT_ONLINE_CHECK_INTERVAL_MS)
  }

  const disposeContactUpdateMonitor = () => {
    socket.off<SocketActionsType>('actual-contacts', actualizeContacts)
    socket.off<SocketActionsType>('contacts-loaded', bulkPut)
    socket.off<SocketActionsType>('contact-delete-success', deleteContact)
    socket.off<SocketActionsType>('contact-add-success', addContact)
    socket.off<SocketActionsType>('contact-status-updated', updateStatus)
    socket.off<SocketActionsType>('contact-data-changed', updateContactDataHandler)
    socket.off<SocketActionsType>('contact-interaction-updated', updateContactInteractionType)
    socket.off<SocketActionsType>('invite-received', processInvitation)
    socket.off<SocketActionsType>('get-contact-typing-status', updateContactTypingStatus)

    if (onlineCheckIntervalId) {
      clearInterval(onlineCheckIntervalId)
    }
  }

  onBeforeUnmount(disposeContactUpdateMonitor)

  return {
    initializeContactUpdateMonitor,
    disposeContactUpdateMonitor
  }
}
