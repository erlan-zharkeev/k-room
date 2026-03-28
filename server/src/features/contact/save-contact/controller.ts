import { IEventContactAddSuccess, IEventSaveContact, SocketActionsType } from 'common'

import { transformUserToContact } from 'src/features/user'

import { UserModel } from 'src/entities/user'

import { SocketInstanceType } from 'src/shared/config'
import { getIO, throwSocketError } from 'src/shared/lib'

export const saveContactController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('save-contact', async ({ interlocutorId }: IEventSaveContact) => {
    const { userId } = socket.data
    try {
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
    } catch {
      throwSocketError(socket.id)
    }
  })
}
