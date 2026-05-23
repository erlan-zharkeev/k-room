import {
  CONTACT_INTERACTION,
  CONTACT_SEARCH_QUERY_MAX_LENGTH,
  CONTACT_SEARCH_RESULT_LIMIT,
  type Contact,
  type EventContactAddSuccess,
  type EventDeleteContactSuccess,
  type EventGetSearchedContact,
  type EventInviteReceived,
  type EventUpdateContactInteractionSuccess,
  type Interaction,
  type SocketActions,
  isAcceptedContactInteraction,
  isBlockedContactInteraction,
  isDefaultContactInteraction,
  isPendingContactInteraction,
  normalizeNickname,
  REQ_STATUS
} from 'global-shared'
import { Types } from 'mongoose'

import { AppError } from 'src/shared/lib/app-error'
import { getIO } from 'src/shared/lib/io'

import type { PresenceService } from '../presence/presence.service'
import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'
import { transformUserToContact } from '../user/user.service'

import { CONTACTS_I18N } from './contacts.i18n'
import { assertContactLimit } from './contacts.utils'

export const emitSearchedContacts = (socketId: string, payload: EventGetSearchedContact) => {
  getIO().to(socketId).emit<SocketActions>('get-searched-contact', payload)
}

export const searchContacts = async (
  userId: string,
  value: string,
  offset: number,
  presenceService: PresenceService
) => {
  let type: 'nickname' | 'id' = 'nickname'
  let validSearch: boolean = true
  const normalizedValue = value.trim()
  let needle = normalizedValue
  const safeOffset = Math.max(0, offset)

  if (normalizedValue.length > CONTACT_SEARCH_QUERY_MAX_LENGTH) {
    throw new AppError(REQ_STATUS.badRequest, CONTACTS_I18N.searchQueryTooLong)
  }

  if (!needle) {
    validSearch = false
  }

  if (needle.startsWith('#')) {
    needle = needle.slice(1)
    type = Types.ObjectId.isValid(needle) ? 'id' : 'nickname'

    if (type === 'nickname' && !needle) {
      validSearch = false
    }
  }

  if (type === 'nickname') {
    needle = normalizeNickname(needle)

    if (!needle) {
      validSearch = false
    }
  }

  let searchedUsers: Contact[] = []

  if (validSearch) {
    const searchFilter = type === 'id' ? { _id: needle } : { 'public.nickname': { $regex: new RegExp(needle, 'i') } }
    const [users, currentUser] = await Promise.all([
      UserModel.find(searchFilter).sort({ 'public.nickname': 1 }).lean(),
      UserModel.findById(userId, { 'personal.contacts': 1 }).lean()
    ])

    if (!currentUser) {
      throw new AppError(REQ_STATUS.notFound, CONTACTS_I18N.searchContactFailed)
    }

    const contactMap = currentUser.personal.contacts

    const onlineMap = await presenceService.onlineMapByUserIds(users.map((user) => user._id))

    searchedUsers = users
      .map((user) =>
        transformUserToContact(
          user,
          (contactMap instanceof Map ? contactMap.get(String(user._id)) : contactMap[String(user._id)])?.interaction ??
            CONTACT_INTERACTION.DEFAULT,
          onlineMap.get(String(user._id)) ?? false
        )
      )
      .filter((user) => user.id !== userId)
      .sort((a, b) => {
        if (a.interactionType === b.interactionType) {
          return a.nickname.localeCompare(b.nickname)
        }

        if (isAcceptedContactInteraction(a.interactionType)) {
          return 1
        }

        if (isAcceptedContactInteraction(b.interactionType)) {
          return -1
        }

        return a.nickname.localeCompare(b.nickname)
      })
  }

  const contacts = searchedUsers.slice(safeOffset, safeOffset + CONTACT_SEARCH_RESULT_LIMIT)
  const hasMore = searchedUsers.length > safeOffset + CONTACT_SEARCH_RESULT_LIMIT

  return {
    value: normalizedValue,
    offset: safeOffset,
    contacts,
    total: searchedUsers.length,
    hasMore,
    nextOffset: hasMore ? safeOffset + contacts.length : undefined
  } satisfies EventGetSearchedContact
}

export const saveContact = async (userId: string, interlocutorId: string, presenceService: PresenceService) => {
  const [selfContact, contactCandidate] = await Promise.all([
    UserModel.findById(userId, { 'personal.contacts': 1 }).lean(),
    UserModel.findById(interlocutorId).lean()
  ])

  if (!selfContact || !contactCandidate) {
    return null
  }

  assertContactLimit(selfContact.personal.contacts, interlocutorId)

  await UserModel.updateOne(
    { _id: userId },
    {
      $set: {
        [`personal.contacts.${interlocutorId}`]: {
          id: interlocutorId,
          interaction: CONTACT_INTERACTION.DEFAULT,
          updatedAt: Date.now()
        }
      }
    }
  )

  return {
    contactData: transformUserToContact(
      contactCandidate,
      CONTACT_INTERACTION.DEFAULT,
      await presenceService.isUserOnline(contactCandidate._id)
    )
  } satisfies EventContactAddSuccess
}

export const createContactInteraction = async (userId: string, contactId: string, interaction: Interaction) => {
  const user = await UserModel.findById(userId, { 'personal.contacts': 1 }).lean()

  if (!user) {
    return null
  }

  assertContactLimit(user.personal.contacts, contactId)

  return UserModel.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        [`personal.contacts.${contactId}`]: {
          id: contactId,
          interaction,
          updatedAt: Date.now()
        }
      }
    },
    { new: true }
  )
}

export const setContactInteraction = async (userId: string, contactId: string, interaction: Interaction) => {
  return UserModel.findOneAndUpdate(
    { _id: userId, [`personal.contacts.${contactId}`]: { $exists: true } },
    {
      $set: {
        [`personal.contacts.${contactId}.interaction`]: interaction,
        updatedAt: Date.now()
      }
    },
    { new: true }
  )
}

export const getContactInteraction = async (userId: string, contactId: string) => {
  const user = await UserModel.findOne({ _id: userId }, { [`personal.contacts.${contactId}.interaction`]: 1 }).lean()

  if (!user) {
    return
  }

  return user.personal.contacts[contactId]?.interaction
}

export const emitContactInteractionUpdated = (userId: string, contactId: string, interaction: Interaction) => {
  emitToUsers([userId], 'contact-interaction-updated', {
    contactId,
    interaction
  } satisfies EventUpdateContactInteractionSuccess)
}

export const deleteContactById = async (userId: string, deletingUserId: string, silent = false) => {
  await UserModel.updateOne({ _id: userId }, { $unset: { [`personal.contacts.${deletingUserId}`]: '' } })

  emitToUsers([userId], 'contact-delete-success', {
    deletedContactId: deletingUserId,
    silent
  } satisfies EventDeleteContactSuccess)

  const deletingContact = await UserModel.findOne(
    { _id: deletingUserId },
    { [`personal.contacts.${userId}.interaction`]: 1 }
  )

  if (!deletingContact) {
    return
  }

  const deletingUserContact = deletingContact.personal.contacts[userId]

  if (!deletingUserContact) {
    return
  }

  const deletingUserInteractionType = deletingUserContact.interaction

  if (isPendingContactInteraction(deletingUserInteractionType)) {
    await deleteContactById(deletingUserId, userId, true)
  }

  if (isAcceptedContactInteraction(deletingUserInteractionType)) {
    await UserModel.updateOne(
      { _id: deletingUserId },
      { $set: { [`personal.contacts.${userId}.interaction`]: CONTACT_INTERACTION.DEFAULT } }
    )

    emitContactInteractionUpdated(String(deletingContact._id), userId, CONTACT_INTERACTION.DEFAULT)
  }
}

export const updateContactInteraction = async (
  userId: string,
  contactId: string,
  interaction: Interaction,
  presenceService: PresenceService
) => {
  const updateAuthorContactInteraction = async () => setContactInteraction(userId, contactId, interaction)
  const updateContactSide = async () => setContactInteraction(contactId, userId, interaction)
  const [currentInteraction, contactSideInteraction] = await Promise.all([
    getContactInteraction(userId, contactId),
    getContactInteraction(contactId, userId)
  ])

  if (isBlockedContactInteraction(currentInteraction) && !isDefaultContactInteraction(interaction)) {
    return { success: false } as const
  }

  if (
    isBlockedContactInteraction(contactSideInteraction) &&
    !isDefaultContactInteraction(interaction) &&
    !isBlockedContactInteraction(interaction)
  ) {
    throw new AppError(REQ_STATUS.badRequest, CONTACTS_I18N.invitationRestricted)
  }

  const handleUpdateContactInteraction = async () => {
    const updatedContact = await updateContactSide()

    if (!updatedContact) {
      return
    }

    emitContactInteractionUpdated(String(updatedContact._id), userId, interaction)
  }

  switch (interaction) {
    case CONTACT_INTERACTION.DEFAULT:
    case CONTACT_INTERACTION.BLOCKED:
      await updateAuthorContactInteraction()
      break
    case CONTACT_INTERACTION.INVITED: {
      const [contactData, authorData] = await Promise.all([
        createContactInteraction(contactId, userId, CONTACT_INTERACTION.INVITE_RECEIVED),
        updateAuthorContactInteraction()
      ])

      if (!contactData || !authorData) {
        break
      }

      const payload: EventInviteReceived = {
        id: String(authorData._id),
        nickname: authorData.public.nickname,
        online: await presenceService.isUserOnline(authorData._id),
        lastSeen: authorData.public.lastSeen,
        interactionType: CONTACT_INTERACTION.INVITE_RECEIVED
      }

      emitToUsers([contactData._id], 'invite-received', payload)
      break
    }
    case CONTACT_INTERACTION.INVITE_ACCEPTED:
      await updateAuthorContactInteraction()
      await handleUpdateContactInteraction()
      break
  }

  return { success: true } as const
}
