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
  const matchedUsers = await UserModel.find({ _id: { $in: userData?.contacts } })
  const contacts = transformUsersToContacts(matchedUsers)
  if (!userData?.socketId) return
  const payload: SocketActionsPayload['getContacts'] = { contacts, messageBody }
  io.to(userData.socketId).emit(SocketActions.GET_CONTACTS, payload)
}
