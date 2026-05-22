import { EventContactAddSuccess, EventSaveContact, SocketActions } from 'common'

import { transformUserToContact } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { SocketInstance } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CONTACT_I18N } from '../i18n'

export const saveContactController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'save-contact',
    socketErrorMiddleware(
      socket,
      async ({ interlocutorId }: EventSaveContact) => {
        const { userId } = socket.data
        const selfContact = await UserModel.findOneAndUpdate(
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
        )
        const contactCandidate = await UserModel.findOne({ _id: interlocutorId })
        if (selfContact && contactCandidate) {
          const payload: EventContactAddSuccess = {
            contactData: transformUserToContact(contactCandidate)
          }
          getIO().to(socket.id).emit<SocketActions>('contact-add-success', payload)
        }
      },
      { basicError: CONTACT_I18N.saveContactFailed }
    )
  )
}
