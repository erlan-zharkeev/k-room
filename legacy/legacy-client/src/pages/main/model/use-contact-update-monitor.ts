import { useEffect, useRef } from 'react'

import {
  EventChangeContactsDataType,
  EventInviteReceivedType,
  IEventContactAddSuccess,
  IEventDeleteContactSuccess,
  IEventGetContactTypingStatus,
  IEventStatusContact,
  IEventUpdateContactInteractionSuccess,
  IFrontendContact,
  SocketActionsType
} from 'common'

import { getRequiredContactSystemData, useContact, useUpdateContactData } from 'src/entities/contact'

import { socket } from 'src/shared/api'
import { useTimeout } from 'src/shared/lib'
import { useNotification } from 'src/shared/notification'

export const useContactUpdateMonitor = () => {
  const { contacts, bulkPut, get, mergeMany, put, remove } = useContact()
  const { updateContactData } = useUpdateContactData()
  const { openBrowserNotification } = useNotification()
  const { startInterval, stopInterval } = useTimeout()
  const contactsRef = useRef(contacts)

  useEffect(() => {
    contactsRef.current = contacts
  }, [contacts])

  const actualizeContacts = async (nextContacts: IFrontendContact[]) => {
    await mergeMany(nextContacts, {
      merge: (current, incoming) => {
        if (current) {
          return {
            ...current,
            ...incoming,
            onlineStatusSyncedAt: Date.now()
          }
        }

        return {
          ...incoming,
          ...getRequiredContactSystemData()
        }
      },
      removeMissing: true
    })
  }

  const deleteContact = async (payload: IEventDeleteContactSuccess) => {
    await remove(payload.deletedContactId)
  }

  const addContact = async (payload: IEventContactAddSuccess) => {
    await put({ ...payload.contactData, ...getRequiredContactSystemData() })
  }

  const updateStatus = (payload: IEventStatusContact) => {
    const { interlocutorId, online, onlineStatusUpdatedTimestamp, lastSeen } = payload
    updateContactData(interlocutorId, {
      online,
      lastSeen,
      onlineStatusSyncedAt: onlineStatusUpdatedTimestamp
    })
  }

  const updateContactDataHandler = async (payload: EventChangeContactsDataType) => {
    updateContactData(payload.id, payload)
  }

  const updateContactInteractionType = async (payload: IEventUpdateContactInteractionSuccess) => {
    await updateContactData(payload.contactId, { interactionType: payload.interaction })
  }

  const processInvitation = async (payload: EventInviteReceivedType) => {
    const existingContact = await get(payload.id)
    const data = existingContact
      ? {
          ...existingContact,
          ...payload,
          onlineStatusSyncedAt: Date.now()
        }
      : {
          ...payload,
          ...getRequiredContactSystemData()
        }

    await put(data)
    openBrowserNotification({
      message: {
        authorName: payload.username,
        body: 'Invite received'
      }
    })
  }

  const updateContactTypingStatus = async (payload: IEventGetContactTypingStatus) => {
    await updateContactData(payload.contactId, { isTyping: payload.isTyping })
  }

  const checkForContactOnline = () => {
    socket.emit<SocketActionsType>('interlocutor-ping')

    const currentTimestamp = Date.now()
    const maxDiffSeconds = 30

    contactsRef.current.forEach((contact) => {
      const outdated = Math.abs(currentTimestamp - contact.onlineStatusSyncedAt) / 1000 > maxDiffSeconds

      if (outdated) {
        updateContactData(contact.id, { online: false })
      }
    })
  }

  useEffect(() => {
    socket.on<SocketActionsType>('actual-contacts', actualizeContacts)
    socket.on<SocketActionsType>('contacts-loaded', bulkPut)
    socket.on<SocketActionsType>('contact-delete-success', deleteContact)
    socket.on<SocketActionsType>('contact-add-success', addContact)
    socket.on<SocketActionsType>('contact-status-updated', updateStatus)
    socket.on<SocketActionsType>('contact-data-changed', updateContactDataHandler)
    socket.on<SocketActionsType>('contact-interaction-updated', updateContactInteractionType)
    socket.on<SocketActionsType>('invite-received', processInvitation)
    socket.on<SocketActionsType>('get-contact-typing-status', updateContactTypingStatus)

    startInterval(checkForContactOnline, 10_000)

    return () => {
      socket.off<SocketActionsType>('actual-contacts', actualizeContacts)
      socket.off<SocketActionsType>('contacts-loaded', bulkPut)
      socket.off<SocketActionsType>('contact-delete-success', deleteContact)
      socket.off<SocketActionsType>('contact-add-success', addContact)
      socket.off<SocketActionsType>('contact-status-updated', updateStatus)
      socket.off<SocketActionsType>('contact-data-changed', updateContactDataHandler)
      socket.off<SocketActionsType>('contact-interaction-updated', updateContactInteractionType)
      socket.off<SocketActionsType>('invite-received', processInvitation)
      socket.off<SocketActionsType>('get-contact-typing-status', updateContactTypingStatus)
      stopInterval()
    }
  }, [bulkPut, contactsRef, mergeMany, openBrowserNotification, remove, startInterval, stopInterval, updateContactData])
}
