import { IEventContactAddSuccess, IEventSaveContact, SocketActionsType } from 'common'

import { transformUserToContact } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { SocketInstanceType } from 'src/shared/config'
import { getIO } from 'src/shared/lib/io'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CONTACT_I18N } from '../i18n'

export const saveContactController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'save-contact',
    socketErrorMiddleware(
      socket,
      async ({ interlocutorId }: IEventSaveContact) => {
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
          const payload: IEventContactAddSuccess = {
            contactData: transformUserToContact(contactCandidate)
          }
          getIO().to(socket.id).emit<SocketActionsType>('contact-add-success', payload)
        }
      },
      { basicError: CONTACT_I18N.saveContactFailed }
    )
  )
}
