import { Injectable } from '@nestjs/common'
import {
  type EventDeleteContact,
  type EventSaveContact,
  type EventSearchContact,
  type EventUpdateInteraction,
  type SocketActions
} from 'global-shared'

import { PresenceService } from 'src/modules/presence/presence.service'
import { emitToUsers } from 'src/modules/presence/presence.utils'
import { socketAckMiddleware, socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types/socket'

import { CONTACTS_I18N } from './contacts.i18n'
import {
  deleteContactById,
  emitSearchedContacts,
  saveContact,
  searchContacts,
  updateContactInteractionType
} from './contacts.service'

@Injectable()
export class ContactsSocketService {
  constructor(private readonly presenceService: PresenceService) {}

  register(socket: SocketInstance) {
    socket.on<SocketActions>(
      'search-contact',
      socketErrorMiddleware(
        socket,
        async ({ value, offset = 0 }: EventSearchContact) => {
          const payload = await searchContacts(socket.data.userId, value, offset, this.presenceService)
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
          const payload = await saveContact(socket.data.userId, interlocutorId, this.presenceService)

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
      socketAckMiddleware<EventUpdateInteraction>(
        socket,
        async ({ contactId, interaction }) => {
          await updateContactInteractionType(socket.data.userId, contactId, interaction, this.presenceService)
        },
        { basicError: CONTACTS_I18N.updateContactInteractionFailed }
      )
    )
  }
}
