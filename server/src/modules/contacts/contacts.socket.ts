import type {
  ContactInteractionUpdateFailedReason,
  EventDeleteContact,
  EventSaveContact,
  EventSearchContact,
  EventUpdateInteraction,
  SocketAckResponse,
  SocketActions
} from 'global-shared'

import type { PresenceService } from 'src/modules/presence/presence.service'
import { emitToUsers } from 'src/modules/presence/presence.utils'
import { socketAckMiddleware, socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

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

export const registerContactsSocketHandlers = (socket: SocketInstance, presenceService: PresenceService) => {
  socket.on<SocketActions>(
    'search-contact',
    socketErrorMiddleware(
      socket,
      async ({ value, offset = 0 }: EventSearchContact) => {
        const payload = await searchContacts(socket.data.userId, value, offset, presenceService)
        emitSearchedContacts(socket.id, payload)
      },
      { basicError: CONTACTS_I18N.searchContactFailed }
    )
  )

  socket.on<SocketActions>(
    'save-contact',
    socketAckMiddleware<EventSaveContact>(
      socket,
      async ({ interlocutorId }) => {
        const payload = await saveContact(socket.data.userId, interlocutorId, presenceService)

        if (!payload) {
          return
        }

        emitToUsers([socket.data.userId], 'contact-add-success', payload)
      },
      { basicError: CONTACTS_I18N.saveContactFailed }
    )
  )

  socket.on<SocketActions>(
    'delete-contact',
    socketAckMiddleware<EventDeleteContact>(
      socket,
      async ({ deletingUserId }) => {
        await deleteContactById(socket.data.userId, deletingUserId)
      },
      { basicError: CONTACTS_I18N.updateContactInteractionFailed }
    )
  )

  socket.on<SocketActions>(
    'update-contact-interaction-type',
    socketAckMiddleware<EventUpdateInteraction, void, ContactInteractionUpdateFailedReason>(
      socket,
      async ({ contactId, interaction }) => {
        const { userId } = socket.data

        if (interaction === 'default') {
          const currentInteraction = await getContactInteraction(userId, contactId)

          if (currentInteraction === 'blocked') {
            const result = await updateContactInteraction(userId, contactId, interaction, presenceService)

            if (result.success) {
              emitContactInteractionUpdated(userId, contactId, interaction)
            }

            return
          }

          await deleteContactById(userId, contactId)
          emitContactInteractionUpdated(userId, contactId, interaction)
          return
        }

        const result = await updateContactInteraction(userId, contactId, interaction, presenceService)

        if (result.success) {
          emitContactInteractionUpdated(userId, contactId, interaction)
          return
        }

        if (result.reason) {
          return {
            ok: false,
            reason: result.reason
          } satisfies SocketAckResponse<void, ContactInteractionUpdateFailedReason>
        }

        const currentInteraction = (await getContactInteraction(userId, contactId)) ?? 'default'

        emitContactInteractionUpdated(userId, contactId, currentInteraction)
      },
      { basicError: CONTACTS_I18N.updateContactInteractionFailed }
    )
  )
}
