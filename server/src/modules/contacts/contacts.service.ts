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
import { normalizeNickname } from 'global-shared'
import { Types } from 'mongoose'

import { getIO } from 'src/shared/lib/io'

import { UserModel } from '../user/user.model'
import { transformUserToContact, getSocketsByUserIds, setUserStatus } from '../user/user.service'

const SEARCH_CONTACT_RESULT_LIMIT = 10

export const emitSearchedContacts = (socketId: string, payload: IEventGetSearchedContact) => {
  getIO().to(socketId).emit<SocketActionsType>('get-searched-contact', payload)
}

export const searchContacts = async (userId: string, value: string, offset = 0) => {
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

    searchedUsers = users
      .map((user) =>
        transformUserToContact(
          user,
          (contactMap instanceof Map ? contactMap.get(String(user._id)) : contactMap[String(user._id)])?.interaction ??
            'default'
        )
      )
      .filter((user) => user.id !== userId && user.interactionType !== 'invite-hidden')
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

export const saveContact = async (userId: string, interlocutorId: string) => {
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
    contactData: transformUserToContact(contactCandidate)
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

export const emitContactInteractionUpdated = (socketId: string, contactId: string, interaction: InteractionType) => {
  getIO()
    .to(socketId)
    .emit<SocketActionsType>('contact-interaction-updated', {
      contactId,
      interaction
    } satisfies IEventUpdateContactInteractionSuccess)
}

export const deleteContactById = async (
  userId: string,
  deletingUserId: string,
  userSocketId: string,
  silent = false
) => {
  await UserModel.updateOne({ _id: userId }, { $unset: { [`personal.contacts.${deletingUserId}`]: '' } })

  getIO()
    .to(userSocketId)
    .emit<SocketActionsType>('contact-delete-success', {
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
  const deletingContactSockets = await getSocketsByUserIds([deletingContact._id])

  if (deletingUserInteractionType === 'invite-received' || deletingUserInteractionType === 'invite-hidden') {
    await Promise.all(
      deletingContactSockets.map(async (socketId) => {
        await deleteContactById(deletingUserId, userId, socketId, true)
      })
    )
  }

  if (deletingUserInteractionType === 'invite-accepted') {
    await UserModel.updateOne(
      { _id: deletingUserId },
      { $set: { [`personal.contacts.${userId}.interaction`]: 'default' } }
    )

    deletingContactSockets.forEach((socketId) => {
      emitContactInteractionUpdated(socketId, userId, 'default')
    })
  }
}

export const updateContactInteraction = async (userId: string, contactId: string, interaction: InteractionType) => {
  const updateAuthorContactInteraction = async () => setContactInteraction(userId, contactId, interaction)
  const updateContactSide = async () => setContactInteraction(contactId, userId, interaction)

  const handleUpdateContactInteraction = async () => {
    const updatedContact = await updateContactSide()

    if (!updatedContact) {
      return
    }

    const sockets = await getSocketsByUserIds([updatedContact._id])

    sockets.forEach((socketId) => {
      emitContactInteractionUpdated(socketId, userId, interaction)
    })
  }

  switch (interaction) {
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
        online: authorData.public.online,
        lastSeen: authorData.public.lastSeen,
        interactionType: 'invite-received'
      }
      const sockets = await getSocketsByUserIds([contactData._id])

      sockets.forEach((socketId) => {
        getIO().to(socketId).emit<SocketActionsType>('invite-received', payload)
      })
      break
    }
    case 'invite-accepted':
      await updateAuthorContactInteraction()
      await handleUpdateContactInteraction()
      break
  }
}

export const updateInterlocutorStatus = async (userId: string) => {
  await setUserStatus(userId, true)
}
