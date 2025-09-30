import { IEventDeleteContactSuccess, IEventUpdateContactInteractionSuccess, SocketActionsType } from "common-types"
import { UserModel } from "entities/user"
import { getSocketsByUserIds } from "features/user/~shared/lib/get-sockets-by-ids"
import { getIO } from "shared-lib"

export const deleteContactById = async (
  userId: string,
  deletingUserId: string,
  userSocketId: string,
  silent = false
) => {
  await UserModel.updateOne({ _id: userId }, { $unset: { [`personal.contacts.${deletingUserId}`]: '' } })

  const payload: IEventDeleteContactSuccess = { deletedContactId: deletingUserId, silent }
  getIO().to(userSocketId).emit<SocketActionsType>('contact-delete-success', payload)

  const deletingContact = await UserModel.findOne(
    { _id: deletingUserId },
    { _id: 1, socketId: 1, [`personal.contacts.${userId}.interaction`]: 1 }
  )


  if (!deletingContact || !deletingContact.personal.contacts?.[userId]?.interaction) return
  const deletingUserInteractionType = deletingContact.personal.contacts[userId].interaction

  const deletingContactSockets = await getSocketsByUserIds([deletingContact._id])


  if (deletingUserInteractionType === 'invite-received' || deletingUserInteractionType === 'invite-hidden') {
    deletingContactSockets.forEach(async (socketId) => {
      await deleteContactById(deletingUserId, userId, socketId, true)
    })
  }

  if (deletingUserInteractionType === 'invite-accepted') {
    await UserModel.updateOne({ _id: deletingUserId }, { $set: { [`personal.contacts.${userId}.interaction`]: 'default' } })
    const payload: IEventUpdateContactInteractionSuccess = {
      contactId: userId,
      interaction: 'default'
    }
    const deletingContactSockets = await getSocketsByUserIds([deletingContact._id])
    deletingContactSockets.forEach((socketId) => {
      getIO().to(socketId).emit<SocketActionsType>('contact-interaction-updated', payload)
    })
  }
}