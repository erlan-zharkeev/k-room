import { UserModel } from '../../../models/user.model'
import { io } from '../../../server'
import { SocketActions, SocketActionsPayload } from '../../../../../types'
import { getUserById } from '../getters/getUserById'
import transformUsersToContacts from '../../../utils/transdusers/transformUsersToContacts'

export const emitContacts = async (userId: string, messageBody: string = '') => {
  const userData = await getUserById(userId)
  const matchedUsers = await UserModel.find({ _id: { $in: userData?.contacts } })
  const contacts = transformUsersToContacts(matchedUsers)
  if (!userData?.socketId) return
  const payload: SocketActionsPayload['getContacts'] = { contacts, messageBody }
  io.to(userData.socketId).emit(SocketActions.GET_CONTACTS, payload)
}

export default emitContacts
