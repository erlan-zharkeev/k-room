import type {
  EventChangeContactsDataType,
  EventGetContactsType,
  EventKnownUsersUpdatedType,
  EventInviteReceivedType,
  IEventContactAddSuccess,
  IEventDeleteContactSuccess,
  IEventGetContactTypingStatus,
  IEventStatusContact,
  IEventUpdateContactInteractionSuccess,
  ContactType
} from 'global-shared'

import { getRequiredContactSystemData, useContact, useUpdateContactData } from 'src/entities/contact'
import { createKnownUser, useKnownUser } from 'src/entities/known-user'

export const useContactSync = () => {
  const { get: getContact, mergeMany: mergeContacts, put: putContact, remove: removeContact } = useContact()
  const { get: getKnownUser, mergeMany: mergeKnownUsers, update: updateKnownUser } = useKnownUser()
  const { updateContactData: updateStoredContactData } = useUpdateContactData()

  const mergeKnownUserData = async (knownUsers: EventKnownUsersUpdatedType, removeMissing = false) => {
    await mergeKnownUsers(knownUsers, {
      merge: (current, incoming) =>
        createKnownUser({
          ...incoming,
          isTyping: current?.isTyping ?? false
        }),
      removeMissing
    })
  }

  const syncKnownUsers = async (knownUsers: EventKnownUsersUpdatedType) => {
    await mergeKnownUserData(knownUsers)
  }

  const syncUserContacts = async (nextContacts: ContactType[]) => {
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

  const actualizeContacts = async ({ contacts: nextContacts, knownUsers }: EventGetContactsType) => {
    await syncUserContacts(nextContacts)
    await mergeKnownUserData(knownUsers, true)
  }

  const deleteContact = async ({ deletedContactId }: IEventDeleteContactSuccess) => {
    await removeContact(deletedContactId)
  }

  const addContact = async ({ contactData }: IEventContactAddSuccess) => {
    await putContact({ ...contactData, ...getRequiredContactSystemData() })
  }

  const updateStatus = async ({ interlocutorId, online, lastSeen }: IEventStatusContact) => {
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

  const updateContactData = async (payload: EventChangeContactsDataType) => {
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

  const updateContactInteractionType = async ({ contactId, interaction }: IEventUpdateContactInteractionSuccess) => {
    const existingContact = await getContact(contactId)

    if (!existingContact) return

    await updateStoredContactData(contactId, { interactionType: interaction })
  }

  const processInvitation = async (payload: EventInviteReceivedType) => {
    const existingContact = await getContact(payload.id)
    const systemData = getRequiredContactSystemData()

    await putContact({
      ...payload,
      savedAt: existingContact?.savedAt ?? systemData.savedAt,
      isTyping: existingContact?.isTyping ?? systemData.isTyping
    })
  }

  const updateContactTypingStatus = async ({ contactId, isTyping }: IEventGetContactTypingStatus) => {
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
