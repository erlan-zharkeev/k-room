import { EventDeleteContactSuccess, EventUpdateContactInteractionSuccess, SocketActions } from 'common'

import { getSocketsByUserIds } from 'src/modules/user'
import { UserModel } from 'src/modules/user'

import { getIO } from 'src/shared/lib/io'

export const deleteContactById = async (
  userId: string,
  deletingUserId: string,
  userSocketId: string,
  silent = false
) => {
  await UserModel.updateOne({ _id: userId }, { $unset: { [`personal.contacts.${deletingUserId}`]: '' } })

  const payload: EventDeleteContactSuccess = { deletedContactId: deletingUserId, silent }
  getIO().to(userSocketId).emit<SocketActions>('contact-delete-success', payload)

  const deletingContact = await UserModel.findOne(
    { _id: deletingUserId },
    { _id: 1, socketId: 1, [`personal.contacts.${userId}.interaction`]: 1 }
  )

  if (!deletingContact || !deletingContact.personal.contacts?.[userId]?.interaction) return
  const deletingUserInteractionType = deletingContact.personal.contacts[userId].interaction

  const deletingContactSockets = await getSocketsByUserIds([deletingContact._id])

  if (deletingUserInteractionType === 'invite-received' || deletingUserInteractionType === 'invite-hidden') {
    deletingContactSockets.forEach(async (socketId: string) => {
      await deleteContactById(deletingUserId, userId, socketId, true)
    })
  }

  if (deletingUserInteractionType === 'invite-accepted') {
    await UserModel.updateOne(
      { _id: deletingUserId },
      { $set: { [`personal.contacts.${userId}.interaction`]: 'default' } }
    )
    const payload: EventUpdateContactInteractionSuccess = {
      contactId: userId,
      interaction: 'default'
    }
    const deletingContactSockets = await getSocketsByUserIds([deletingContact._id])
    deletingContactSockets.forEach((socketId: string) => {
      getIO().to(socketId).emit<SocketActions>('contact-interaction-updated', payload)
    })
  }
}
