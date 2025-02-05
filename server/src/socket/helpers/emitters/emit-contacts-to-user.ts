import { UserModel } from '../../../models'
import { io } from '../../../server'
import { NotificationMessage, SocketActionsPayload, SocketActions } from '../../../@types'
import { transformUsersToContacts } from '../../../utils'
import { getUserById } from '../getters'

export const emitContactsToUser = async (
  userId: string,
  messageBody: NotificationMessage = NotificationMessage.default
) => {
  const userData = await getUserById(userId)
  if (!userData || !userData.contacts) return
  const contactIds = Object.keys(userData.contacts)
  const matchedUsers = await UserModel.find({ _id: { $in: contactIds } })
  const contacts = transformUsersToContacts(matchedUsers, userData?.contacts)
  if (!userData?.socketId) return
  const payload: SocketActionsPayload['getContacts'] = { contacts, messageBody }
  io.to(userData.socketId).emit(SocketActions.GET_CONTACTS, payload)
}
