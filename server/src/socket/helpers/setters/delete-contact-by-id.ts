import { IEventDeleteContactSuccess, IEventUpdateContactInteractionSuccess, SocketActionsType } from '../../../@types'
import { UserModel } from '../../../models'
import { io } from '../../../server'

export const deleteContactById = async (
  userId: string,
  deletingUserId: string,
  userSocketId: string,
  silent = false
) => {
  await UserModel.updateOne({ _id: userId }, { $unset: { [`contacts.${deletingUserId}`]: '' } })

  const payload: IEventDeleteContactSuccess = { deletedContactId: deletingUserId, silent }
  io.to(userSocketId).emit<SocketActionsType>('contact-delete-success', payload)

  const deletingContact = await UserModel.findOne(
    { _id: deletingUserId },
    { _id: 1, socketId: 1, [`contacts.${userId}.interaction`]: 1 }
  )

  if (!deletingContact || !deletingContact.contacts?.[userId]?.interaction) return
  const deletingUserInteractionType = deletingContact.contacts[userId].interaction

  if (deletingUserInteractionType === 'invite-received' || deletingUserInteractionType === 'invite-hidden') {
    await deleteContactById(deletingUserId, userId, deletingContact.socketId, true)
  }

  if (deletingUserInteractionType === 'invite-accepted') {
    await UserModel.updateOne({ _id: deletingUserId }, { $set: { [`contacts.${userId}.interaction`]: 'default' } })
    const payload: IEventUpdateContactInteractionSuccess = {
      contactId: userId,
      interaction: 'default'
    }
    io.to(deletingContact.socketId).emit<SocketActionsType>('contact-interaction-type-updated', payload)
  }
}
