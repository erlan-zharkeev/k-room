import { Injectable } from '@nestjs/common'
import {
  type EventDeleteContact,
  type EventSaveContact,
  type EventSearchContact,
  type EventUpdateInteraction
} from 'global-shared'

import { NotificationsService } from 'src/modules/notifications/notifications.service'
import { PresenceService } from 'src/modules/presence/presence.service'
import { emitToUsers } from 'src/modules/presence/presence.utils'
import { socketAckMiddleware, socketErrorMiddleware } from 'src/shared/lib/socket-error'
import type { SocketInstance } from 'src/shared/types'

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
  constructor(
    private readonly presenceService: PresenceService,
    private readonly notificationsService: NotificationsService
  ) {}

  register(socket: SocketInstance) {
    socket.on(
      'search-contact',
      socketErrorMiddleware<EventSearchContact>(
        socket,
        async ({ value, offset = 0 }) => {
          const payload = await searchContacts(socket.data.userId, value, offset, this.presenceService)
          emitSearchedContacts(socket.id, payload)
        },
        { basicError: CONTACTS_I18N.searchContactFailed }
      )
    )

    socket.on(
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

    socket.on(
      'delete-contact',
      socketAckMiddleware<EventDeleteContact>(
        socket,
        async ({ deletingUserId }) => {
          await deleteContactById(socket.data.userId, deletingUserId)
        },
        { basicError: CONTACTS_I18N.updateContactInteractionFailed }
      )
    )

    socket.on(
      'update-contact-interaction-type',
      socketAckMiddleware<EventUpdateInteraction>(
        socket,
        async ({ contactId, interaction }) => {
          await updateContactInteractionType(
            socket.data.userId,
            contactId,
            interaction,
            this.presenceService,
            this.notificationsService
          )
        },
        { basicError: CONTACTS_I18N.updateContactInteractionFailed }
      )
    )
  }
}
