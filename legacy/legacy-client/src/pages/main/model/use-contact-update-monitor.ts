import { useEffect, useRef } from 'react'

import {
  EventChangeContactsData,
  EventInviteReceived,
  EventContactAddSuccess,
  EventDeleteContactSuccess,
  EventGetContactTypingStatus,
  EventStatusContact,
  EventUpdateContactInteractionSuccess,
  IFrontendContact,
  SocketActions
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

  const deleteContact = async (payload: EventDeleteContactSuccess) => {
    await remove(payload.deletedContactId)
  }

  const addContact = async (payload: EventContactAddSuccess) => {
    await put({ ...payload.contactData, ...getRequiredContactSystemData() })
  }

  const updateStatus = (payload: EventStatusContact) => {
    const { interlocutorId, online, onlineStatusUpdatedTimestamp, lastSeen } = payload
    updateContactData(interlocutorId, {
      online,
      lastSeen,
      onlineStatusSyncedAt: onlineStatusUpdatedTimestamp
    })
  }

  const updateContactDataHandler = async (payload: EventChangeContactsData) => {
    updateContactData(payload.id, payload)
  }

  const updateContactInteractionType = async (payload: EventUpdateContactInteractionSuccess) => {
    await updateContactData(payload.contactId, { interactionType: payload.interaction })
  }

  const processInvitation = async (payload: EventInviteReceived) => {
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

  const updateContactTypingStatus = async (payload: EventGetContactTypingStatus) => {
    await updateContactData(payload.contactId, { isTyping: payload.isTyping })
  }

  const checkForContactOnline = () => {
    socket.emit<SocketActions>('interlocutor-ping')

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
    socket.on<SocketActions>('actual-contacts', actualizeContacts)
    socket.on<SocketActions>('contacts-loaded', bulkPut)
    socket.on<SocketActions>('contact-delete-success', deleteContact)
    socket.on<SocketActions>('contact-add-success', addContact)
    socket.on<SocketActions>('contact-status-updated', updateStatus)
    socket.on<SocketActions>('contact-data-changed', updateContactDataHandler)
    socket.on<SocketActions>('contact-interaction-updated', updateContactInteractionType)
    socket.on<SocketActions>('invite-received', processInvitation)
    socket.on<SocketActions>('get-contact-typing-status', updateContactTypingStatus)

    startInterval(checkForContactOnline, 10_000)

    return () => {
      socket.off<SocketActions>('actual-contacts', actualizeContacts)
      socket.off<SocketActions>('contacts-loaded', bulkPut)
      socket.off<SocketActions>('contact-delete-success', deleteContact)
      socket.off<SocketActions>('contact-add-success', addContact)
      socket.off<SocketActions>('contact-status-updated', updateStatus)
      socket.off<SocketActions>('contact-data-changed', updateContactDataHandler)
      socket.off<SocketActions>('contact-interaction-updated', updateContactInteractionType)
      socket.off<SocketActions>('invite-received', processInvitation)
      socket.off<SocketActions>('get-contact-typing-status', updateContactTypingStatus)
      stopInterval()
    }
  }, [bulkPut, contactsRef, mergeMany, openBrowserNotification, remove, startInterval, stopInterval, updateContactData])
}
