import type {
  EventInviteReceivedType,
  IEventContactAddSuccess,
  IEventDeleteContactSuccess,
  IEventGetSearchedContact,
  IEventUpdateContactInteractionSuccess,
  IFrontendContact,
  InteractionType,
  SocketActionsType
} from 'global-shared'
import { CONTACT_INTERACTION_UPDATE_FAILED_REASONS, normalizeNickname } from 'global-shared'
import { Types } from 'mongoose'

import { getIO } from 'src/shared/lib/io'

import type { PresenceService } from '../presence/presence.service'
import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'
import { transformUserToContact } from '../user/user.service'

import { SEARCH_CONTACT_RESULT_LIMIT } from './constants'

export const emitSearchedContacts = (socketId: string, payload: IEventGetSearchedContact) => {
  getIO().to(socketId).emit<SocketActionsType>('get-searched-contact', payload)
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

  let searchedUsers: IFrontendContact[] = []

  if (validSearch) {
    const searchFilter = type === 'id' ? { _id: needle } : { 'public.nickname': { $regex: new RegExp(needle, 'i') } }
    const [users, currentUser] = await Promise.all([
      UserModel.find(searchFilter).sort({ 'public.nickname': 1 }).lean(),
      UserModel.findById(userId, { 'personal.contacts': 1 }).lean()
    ])
    const contactMap = currentUser?.personal?.contacts ?? {}

    const onlineMap = await presenceService.onlineMapByUserIds(users.map((user) => user._id))

    searchedUsers = users
      .map((user) =>
        transformUserToContact(
          user,
          (contactMap instanceof Map ? contactMap.get(String(user._id)) : contactMap[String(user._id)])?.interaction ??
            'default',
          onlineMap.get(String(user._id)) ?? false
        )
      )
      .filter((user) => user.id !== userId)
      .sort((a, b) => {
        if (a.interactionType === b.interactionType) {
          return a.nickname.localeCompare(b.nickname)
        }

        if (a.interactionType === 'invite-accepted') {
          return 1
        }

        if (b.interactionType === 'invite-accepted') {
          return -1
        }

        return a.nickname.localeCompare(b.nickname)
      })
  }

  const contacts = searchedUsers.slice(safeOffset, safeOffset + SEARCH_CONTACT_RESULT_LIMIT)
  const hasMore = searchedUsers.length > safeOffset + SEARCH_CONTACT_RESULT_LIMIT

  return {
    value: normalizedValue,
    offset: safeOffset,
    contacts,
    total: searchedUsers.length,
    hasMore,
    nextOffset: hasMore ? safeOffset + contacts.length : undefined
  } satisfies IEventGetSearchedContact
}

export const saveContact = async (userId: string, interlocutorId: string, presenceService: PresenceService) => {
  const [selfContact, contactCandidate] = await Promise.all([
    UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          [`personal.contacts.${interlocutorId}`]: {
            id: interlocutorId,
            interaction: 'default',
            updatedAt: Date.now()
          }
        }
      },
      { new: true }
    ),
    UserModel.findById(interlocutorId).lean()
  ])

  if (!selfContact || !contactCandidate) {
    return null
  }

  return {
    contactData: transformUserToContact(
      contactCandidate,
      'default',
      await presenceService.isUserOnline(contactCandidate._id)
    )
  } satisfies IEventContactAddSuccess
}

export const createContactInteraction = async (docId: string, contactId: string, interaction: InteractionType) => {
  return UserModel.findOneAndUpdate(
    { _id: docId },
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

export const setContactInteraction = async (docId: string, contactId: string, interaction: InteractionType) => {
  return UserModel.findOneAndUpdate(
    { _id: docId, [`personal.contacts.${contactId}`]: { $exists: true } },
    {
      $set: {
        [`personal.contacts.${contactId}.interaction`]: interaction,
        updatedAt: Date.now()
      }
    },
    { new: true }
  )
}

export const getContactInteraction = async (docId: string, contactId: string) => {
  const user = await UserModel.findOne({ _id: docId }, { [`personal.contacts.${contactId}.interaction`]: 1 }).lean()

  return user?.personal.contacts?.[contactId]?.interaction
}

export const emitContactInteractionUpdated = (userId: string, contactId: string, interaction: InteractionType) => {
  emitToUsers([userId], 'contact-interaction-updated', {
    contactId,
    interaction
  } satisfies IEventUpdateContactInteractionSuccess)
}

export const deleteContactById = async (userId: string, deletingUserId: string, silent = false) => {
  await UserModel.updateOne({ _id: userId }, { $unset: { [`personal.contacts.${deletingUserId}`]: '' } })

  emitToUsers([userId], 'contact-delete-success', {
    deletedContactId: deletingUserId,
    silent
  } satisfies IEventDeleteContactSuccess)

  const deletingContact = await UserModel.findOne(
    { _id: deletingUserId },
    { [`personal.contacts.${userId}.interaction`]: 1 }
  )

  if (!deletingContact?.personal.contacts?.[userId]?.interaction) {
    return
  }

  const deletingUserInteractionType = deletingContact.personal.contacts[userId].interaction

  if (deletingUserInteractionType === 'invite-received' || deletingUserInteractionType === 'invited') {
    await deleteContactById(deletingUserId, userId, true)
  }

  if (deletingUserInteractionType === 'invite-accepted') {
    await UserModel.updateOne(
      { _id: deletingUserId },
      { $set: { [`personal.contacts.${userId}.interaction`]: 'default' } }
    )

    emitContactInteractionUpdated(String(deletingContact._id), userId, 'default')
  }
}

export const updateContactInteraction = async (
  userId: string,
  contactId: string,
  interaction: InteractionType,
  presenceService: PresenceService
) => {
  const updateAuthorContactInteraction = async () => setContactInteraction(userId, contactId, interaction)
  const updateContactSide = async () => setContactInteraction(contactId, userId, interaction)
  const [currentInteraction, contactSideInteraction] = await Promise.all([
    getContactInteraction(userId, contactId),
    getContactInteraction(contactId, userId)
  ])

  if (currentInteraction === 'blocked' && interaction !== 'default') {
    return { success: false } as const
  }

  if (contactSideInteraction === 'blocked' && interaction !== 'default' && interaction !== 'blocked') {
    return {
      success: false,
      reason: CONTACT_INTERACTION_UPDATE_FAILED_REASONS.INVITATION_RESTRICTED
    } as const
  }

  const handleUpdateContactInteraction = async () => {
    const updatedContact = await updateContactSide()

    if (!updatedContact) {
      return
    }

    emitContactInteractionUpdated(String(updatedContact._id), userId, interaction)
  }

  switch (interaction) {
    case 'default':
    case 'blocked':
      await updateAuthorContactInteraction()
      break
    case 'invited': {
      const [contactData, authorData] = await Promise.all([
        createContactInteraction(contactId, userId, 'invite-received'),
        updateAuthorContactInteraction()
      ])

      if (!contactData || !authorData) {
        break
      }

      const payload: EventInviteReceivedType = {
        id: String(authorData._id),
        nickname: authorData.public.nickname,
        online: await presenceService.isUserOnline(authorData._id),
        lastSeen: authorData.public.lastSeen,
        interactionType: 'invite-received'
      }

      emitToUsers([contactData._id], 'invite-received', payload)
      break
    }
    case 'invite-accepted':
      await updateAuthorContactInteraction()
      await handleUpdateContactInteraction()
      break
  }

  return { success: true } as const
}
