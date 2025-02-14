import { EventDeleteContactSuccess, EventUpdateContactInteractionTypeSuccess, SocketActions } from '../../../@types'
import { UserModel } from '../../../models'
import { io } from '../../../server'

export const deleteContactById = async (
  userId: string,
  deletingUserId: string,
  userSocketId: string,
  silent = false
) => {
  await UserModel.updateOne({ _id: userId }, { $unset: { [`contacts.${deletingUserId}`]: '' } })

  const payload: EventDeleteContactSuccess = { deletedContactId: deletingUserId, silent }
  io.to(userSocketId).emit<SocketActions>('contact-delete-success', payload)

  const deletingContact = await UserModel.findOne(
    { _id: deletingUserId },
    { _id: 1, socketId: 1, [`contacts.${userId}.interactionType`]: 1 }
  )

  if (!deletingContact || !deletingContact.contacts?.[userId]?.interactionType) return
  const deletingUserInteractionType = deletingContact.contacts[userId].interactionType

  if (deletingUserInteractionType === 'invite-received' || deletingUserInteractionType === 'invite-hidden') {
    await deleteContactById(deletingUserId, userId, deletingContact.socketId, true)
  }

  if (deletingUserInteractionType === 'invite-accepted') {
    await UserModel.updateOne({ _id: deletingUserId }, { $set: { [`contacts.${userId}.interactionType`]: 'default' } })
    const payload: EventUpdateContactInteractionTypeSuccess = {
      contactId: userId,
      interactionType: 'default'
    }
    io.to(deletingContact.socketId).emit<SocketActions>('contact-interaction-type-updated', payload)
  }
}
