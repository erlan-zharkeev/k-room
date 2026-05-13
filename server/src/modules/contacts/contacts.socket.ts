import type {
  IEventDeleteContact,
  IEventSaveContact,
  IEventSearchContact,
  IEventUpdateInteraction,
  SocketActionsType
} from 'global-shared'

import type { PresenceService } from 'src/modules/presence/presence.service'
import { emitToUsers } from 'src/modules/presence/presence.utils'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { CONTACTS_I18N } from './contacts.i18n'
import {
  deleteContactById,
  emitContactInteractionUpdated,
  emitSearchedContacts,
  getContactInteraction,
  saveContact,
  searchContacts,
  updateContactInteraction
} from './contacts.service'

export const registerContactsSocketHandlers = (socket: SocketInstanceType, presenceService: PresenceService) => {
  socket.on<SocketActionsType>(
    'search-contact',
    socketErrorMiddleware(
      socket,
      async ({ value, offset = 0 }: IEventSearchContact) => {
        const payload = await searchContacts(socket.data.userId, value, offset, presenceService)
        emitSearchedContacts(socket.id, payload)
      },
      { basicError: CONTACTS_I18N.searchContactFailed }
    )
  )

  socket.on<SocketActionsType>(
    'save-contact',
    socketErrorMiddleware(
      socket,
      async ({ interlocutorId }: IEventSaveContact) => {
        const payload = await saveContact(socket.data.userId, interlocutorId, presenceService)

        if (!payload) {
          return
        }

        emitToUsers([socket.data.userId], 'contact-add-success', payload)
      },
      { basicError: CONTACTS_I18N.saveContactFailed }
    )
  )

  socket.on<SocketActionsType>(
    'delete-contact',
    socketErrorMiddleware(
      socket,
      async ({ deletingUserId }: IEventDeleteContact) => {
        await deleteContactById(socket.data.userId, deletingUserId)
      },
      { basicError: CONTACTS_I18N.updateContactInteractionFailed }
    )
  )

  socket.on<SocketActionsType>(
    'update-contact-interaction-type',
    socketErrorMiddleware(
      socket,
      async ({ contactId, interaction }: IEventUpdateInteraction) => {
        const { userId } = socket.data

        if (interaction === 'default') {
          const currentInteraction = await getContactInteraction(userId, contactId)

          if (currentInteraction === 'blocked') {
            const updated = await updateContactInteraction(userId, contactId, interaction, presenceService)

            if (updated) {
              emitContactInteractionUpdated(userId, contactId, interaction)
            }

            return
          }

          await deleteContactById(userId, contactId)
          emitContactInteractionUpdated(userId, contactId, interaction)
          return
        }

        const updated = await updateContactInteraction(userId, contactId, interaction, presenceService)

        if (updated) {
          emitContactInteractionUpdated(userId, contactId, interaction)
        } else {
          const currentInteraction = (await getContactInteraction(userId, contactId)) ?? 'default'

          emitContactInteractionUpdated(userId, contactId, currentInteraction)
        }
      },
      { basicError: CONTACTS_I18N.updateContactInteractionFailed }
    )
  )
}
