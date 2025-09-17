import { IEventContactAddSuccess, IEventSaveContact, SocketActionsType } from 'common-types'
import { UserModel } from 'entities/user'
import { transformUserToContact } from 'features/user/~shared/lib/transform-user-to-frontend-contact'
import { SocketInstanceType } from 'shared-config'
import { getIO, throwSocketError } from 'shared-lib'


export const controller = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('save-contact', async ({ interlocutorId }: IEventSaveContact) => {
    const { userId } = socket.data
    try {
      const selfContact = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: { [`personal.contacts.${interlocutorId}`]: { id: interlocutorId, interaction: 'default', updatedAt: Date.now() } }
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