import {
  CONTACT_SEARCH_QUERY_MAX_LENGTH,
  CONTACT_SEARCH_RESULT_LIMIT,
  type Contact,
  type EventContactAddSuccess,
  type EventGetSearchedContact,
  type Interaction,
  isAcceptedContactInteraction,
  isBlockedContactInteraction,
  isDefaultContactInteraction,
  isPendingContactInteraction,
  REQ_STATUS
} from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'
import { getIO } from 'src/shared/lib/io'
import { isValidMongoId, stringifyMongoId } from 'src/shared/lib/normalize-object-id'
import { emitSocketEvent } from 'src/shared/lib/transport-meta'
import type { EmitServerToClientSocketEvent } from 'src/shared/types'

import type { NotificationsService } from '../notifications/notifications.service'
import type { PresenceService } from '../presence/presence.service'
import { emitToUsers } from '../presence/presence.utils'
import { transformUserToContact } from '../user/lib/transform-user'
import {
  createUserContactInteraction,
  deleteUserContact,
  loadContactSearchUsersById,
  loadContactSearchUsersByNickname,
  loadUserById,
  loadUserContactInteraction,
  loadUserContactInteractionDocument,
  loadUserContactsById,
  setDefaultUserContact,
  setExistingUserContactInteraction
} from '../user/lib/user-persistence'

import { CONTACTS_I18N } from './contacts.i18n'
import { assertContactLimit } from './contacts.utils'

export const emitSearchedContacts = (socketId: string, payload: EventGetSearchedContact) => {
  const room = getIO().to(socketId)
  const emit = room.emit.bind(room) as EmitServerToClientSocketEvent

  emitSocketEvent(emit, 'get-searched-contact', payload)
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
    type = isValidMongoId(needle) ? 'id' : 'nickname'

    if (type === 'nickname' && !needle) {
      validSearch = false
    }
  }

  let searchedUsers: Contact[] = []

  if (validSearch) {
    const [users, currentUser] = await Promise.all([
      type === 'id' ? loadContactSearchUsersById(needle) : loadContactSearchUsersByNickname(needle),
      loadUserContactsById(userId)
    ])

    if (!currentUser) {
      throw new AppError(REQ_STATUS.notFound, CONTACTS_I18N.searchContactFailed)
    }

    const contactMap = currentUser.personal.contacts

    const onlineMap = await presenceService.onlineMapByUserIds(users.map((user) => user._id))

    searchedUsers = users.map((user) => {
      const userId = stringifyMongoId(user._id)

      return transformUserToContact(
        user,
        (contactMap instanceof Map ? contactMap.get(userId) : contactMap[userId])?.interaction ?? 'default',
        onlineMap.get(userId) ?? false
      )
    })
    searchedUsers = searchedUsers
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
    loadUserContactsById(userId),
    loadUserById(interlocutorId)
  ])

  if (!selfContact || !contactCandidate) {
    return null
  }

  assertContactLimit(selfContact.personal.contacts, interlocutorId)

  await setDefaultUserContact(userId, interlocutorId)

  return {
    contactData: transformUserToContact(
      contactCandidate,
      'default',
      await presenceService.isUserOnline(contactCandidate._id)
    )
  } satisfies EventContactAddSuccess
}

export const createContactInteraction = async (userId: string, contactId: string, interaction: Interaction) => {
  const user = await loadUserContactsById(userId)

  if (!user) {
    return null
  }

  assertContactLimit(user.personal.contacts, contactId)

  return createUserContactInteraction(userId, contactId, interaction)
}

export const setContactInteraction = async (userId: string, contactId: string, interaction: Interaction) => {
  return setExistingUserContactInteraction(userId, contactId, interaction)
}

export const getContactInteraction = async (userId: string, contactId: string) => {
  return loadUserContactInteraction(userId, contactId)
}

export const emitContactInteractionUpdated = (userId: string, contactId: string, interaction: Interaction) => {
  emitToUsers([userId], 'contact-interaction-updated', {
    contactId,
    interaction
  })
}

export const deleteContactById = async (userId: string, deletingUserId: string, silent = false) => {
  await deleteUserContact(userId, deletingUserId)

  emitToUsers([userId], 'contact-delete-success', {
    deletedContactId: deletingUserId,
    silent
  })

  const deletingContact = await loadUserContactInteractionDocument(deletingUserId, userId)

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
    await setExistingUserContactInteraction(deletingUserId, userId, 'default')

    emitContactInteractionUpdated(stringifyMongoId(deletingContact._id), userId, 'default')
  }
}

export const updateContactInteraction = async (
  userId: string,
  contactId: string,
  interaction: Interaction,
  presenceService: PresenceService,
  notificationsService?: Pick<NotificationsService, 'sendInvitePushNotifications'>
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

    emitContactInteractionUpdated(stringifyMongoId(updatedContact._id), userId, interaction)
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

      const payload: Contact = transformUserToContact(
        authorData,
        'invite-received',
        await presenceService.isUserOnline(authorData._id)
      )

      emitToUsers([contactData._id], 'invite-received', payload)
      void notificationsService?.sendInvitePushNotifications({
        inviterId: userId,
        inviterNickname: payload.nickname,
        recipientId: stringifyMongoId(contactData._id)
      })
      break
    }
    case 'invite-accepted':
      await updateAuthorContactInteraction()
      await handleUpdateContactInteraction()
      break
  }

  return { success: true } as const
}

export const updateContactInteractionType = async (
  userId: string,
  contactId: string,
  interaction: Interaction,
  presenceService: PresenceService,
  notificationsService?: Pick<NotificationsService, 'sendInvitePushNotifications'>
) => {
  if (isDefaultContactInteraction(interaction)) {
    const currentInteraction = await getContactInteraction(userId, contactId)

    if (isBlockedContactInteraction(currentInteraction)) {
      const result = await updateContactInteraction(
        userId,
        contactId,
        interaction,
        presenceService,
        notificationsService
      )

      if (result.success) {
        emitContactInteractionUpdated(userId, contactId, interaction)
      }

      return
    }

    await deleteContactById(userId, contactId)
    emitContactInteractionUpdated(userId, contactId, interaction)

    return
  }

  const result = await updateContactInteraction(userId, contactId, interaction, presenceService, notificationsService)

  if (result.success) {
    emitContactInteractionUpdated(userId, contactId, interaction)

    return
  }

  const currentInteraction = (await getContactInteraction(userId, contactId)) ?? 'default'

  emitContactInteractionUpdated(userId, contactId, currentInteraction)
}
