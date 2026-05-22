import type {
  EventChangeContactsData,
  EventGetContacts,
  EventKnownUsersUpdated,
  EventInviteReceived,
  EventContactAddSuccess,
  EventDeleteContactSuccess,
  EventGetContactTypingStatus,
  EventStatusContact,
  EventUpdateContactInteractionSuccess,
  Contact
} from 'global-shared'

import { getRequiredContactSystemData, useContact, useUpdateContactData } from 'src/entities/contact'
import { createKnownUser, useKnownUser } from 'src/entities/known-user'

export const useContactSync = () => {
  const { get: getContact, mergeMany: mergeContacts, put: putContact, remove: removeContact } = useContact()
  const { get: getKnownUser, mergeMany: mergeKnownUsers, update: updateKnownUser } = useKnownUser()
  const { updateContactData: updateStoredContactData } = useUpdateContactData()

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
      merge: (current, incoming) => {
        const systemData = getRequiredContactSystemData()

        return {
          ...incoming,
          savedAt: current?.savedAt ?? systemData.savedAt,
          isTyping: current?.isTyping ?? systemData.isTyping
        }
      },
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

  const updateContactData = async (payload: EventChangeContactsData) => {
    const [existingContact, existingKnownUser] = await Promise.all([getContact(payload.id), getKnownUser(payload.id)])
    const changes = {
      nickname: payload.nickname
    }

    if (existingContact) {
      await updateStoredContactData(payload.id, changes)
    }

    if (existingKnownUser) {
      await updateKnownUser(payload.id, changes)
    }
  }

  const updateContactInteractionType = async ({ contactId, interaction }: EventUpdateContactInteractionSuccess) => {
    const existingContact = await getContact(contactId)

    if (!existingContact) return

    await updateStoredContactData(contactId, { interactionType: interaction })
  }

  const processInvitation = async (payload: EventInviteReceived) => {
    const existingContact = await getContact(payload.id)
    const systemData = getRequiredContactSystemData()

    await putContact({
      ...payload,
      savedAt: existingContact?.savedAt ?? systemData.savedAt,
      isTyping: existingContact?.isTyping ?? systemData.isTyping
    })
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
    processInvitation,
    updateContactTypingStatus
  }
}
