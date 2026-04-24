import type { IEventSaveContact, IEventSearchContact, IEventUpdateInteraction, SocketActionsType } from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstanceType } from 'src/shared/types/socket'

import { CONTACTS_I18N } from './contacts.i18n'
import {
  deleteContactById,
  emitContactInteractionUpdated,
  emitSearchedContacts,
  saveContact,
  searchContacts,
  updateContactInteraction,
  updateInterlocutorStatus
} from './contacts.service'

export const registerContactsSocketHandlers = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'search-contact',
    socketErrorMiddleware(
      socket,
      async ({ value, offset = 0 }: IEventSearchContact) => {
        const payload = await searchContacts(socket.data.userId, value, offset)
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
        const payload = await saveContact(socket.data.userId, interlocutorId)

        if (!payload) {
          return
        }

        getIO().to(socket.id).emit<SocketActionsType>('contact-add-success', payload)
      },
      { basicError: CONTACTS_I18N.saveContactFailed }
    )
  )

  socket.on<SocketActionsType>(
    'interlocutor-ping',
    socketErrorMiddleware(
      socket,
      async () => {
        await updateInterlocutorStatus(socket.data.userId)
      },
      { basicError: CONTACTS_I18N.interlocutorPingFailed }
    )
  )

  socket.on<SocketActionsType>(
    'update-contact-interaction-type',
    socketErrorMiddleware(
      socket,
      async ({ contactId, interaction }: IEventUpdateInteraction) => {
        const { userId } = socket.data

        if (interaction === 'default') {
          await deleteContactById(userId, contactId, socket.id)
        } else {
          await updateContactInteraction(userId, contactId, interaction)
        }

        emitContactInteractionUpdated(socket.id, contactId, interaction)
      },
      { basicError: CONTACTS_I18N.updateContactInteractionFailed }
    )
  )
}
