import type {
  Contact,
  EventGetContacts,
  EventKnownUsersUpdated,
  EventContactAddSuccess,
  EventDeleteContactSuccess,
  EventGetContactTypingStatus,
  EventStatusContact,
  EventUpdateContactInteractionSuccess,
  UserPreview
} from 'global-shared'

import { getRequiredContactSystemData, mergeContactLocalState, useContact } from 'src/entities/contact'
import { createKnownUser, useKnownUser } from 'src/entities/known-user'

export const useContactSync = () => {
  const {
    get: getContact,
    mergeMany: mergeContacts,
    put: putContact,
    remove: removeContact,
    update: updateStoredContactData
  } = useContact()
  const { get: getKnownUser, mergeMany: mergeKnownUsers, update: updateKnownUser } = useKnownUser()

  const mergeKnownUserData = async (knownUsers: EventKnownUsersUpdated, removeMissing = false) => {
    await mergeKnownUsers(knownUsers, {
      merge: (current, incoming) =>
        createKnownUser({
          ...incoming,
          isTyping: current?.isTyping ?? false
        }),
      removeMissing
    })
  }

  const syncKnownUsers = async (knownUsers: EventKnownUsersUpdated) => {
    await mergeKnownUserData(knownUsers)
  }

  const syncUserContacts = async (nextContacts: Contact[]) => {
    await mergeContacts(nextContacts, {
      merge: mergeContactLocalState,
      removeMissing: true
    })
  }

  const actualizeContacts = async ({ contacts: nextContacts, knownUsers }: EventGetContacts) => {
    await syncUserContacts(nextContacts)
    await mergeKnownUserData(knownUsers, true)
  }

  const deleteContact = async ({ deletedContactId }: EventDeleteContactSuccess) => {
    await removeContact(deletedContactId)
  }

  const addContact = async ({ contactData }: EventContactAddSuccess) => {
    await putContact({ ...contactData, ...getRequiredContactSystemData() })
  }

  const updateStatus = async ({ interlocutorId, online, lastSeen }: EventStatusContact) => {
    const [existingContact, existingKnownUser] = await Promise.all([
      getContact(interlocutorId),
      getKnownUser(interlocutorId)
    ])
    const changes = {
      online,
      ...(lastSeen === undefined ? {} : { lastSeen })
    }

    if (existingContact) {
      await updateStoredContactData(interlocutorId, changes)
    }

    if (existingKnownUser) {
      await updateKnownUser(interlocutorId, changes)
    }
  }

  const updateContactData = async ({ avatarId, id, nickname }: UserPreview) => {
    const [existingContact, existingKnownUser] = await Promise.all([getContact(id), getKnownUser(id)])
    const changes = {
      avatarId,
      nickname
    }

    if (existingContact) {
      await updateStoredContactData(id, changes)
    }

    if (existingKnownUser) {
      await updateKnownUser(id, changes)
    }
  }

  const updateContactInteractionType = async ({ contactId, interaction }: EventUpdateContactInteractionSuccess) => {
    const existingContact = await getContact(contactId)

    if (!existingContact) return

    await updateStoredContactData(contactId, { interactionType: interaction })
  }

  const updateContactTypingStatus = async ({ contactId, isTyping }: EventGetContactTypingStatus) => {
    const [existingContact, existingKnownUser] = await Promise.all([getContact(contactId), getKnownUser(contactId)])

    if (existingContact) {
      await updateStoredContactData(contactId, { isTyping })
    }

    if (existingKnownUser) {
      await updateKnownUser(contactId, { isTyping })
    }
  }

  return {
    actualizeContacts,
    syncKnownUsers,
    deleteContact,
    addContact,
    updateStatus,
    updateContactData,
    updateContactInteractionType,
    updateContactTypingStatus
  }
}
