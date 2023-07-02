import { UserModel } from '../../../models/user.model'
import { io } from '../../../server'
import { SocketActions } from '../../../../../types'
import { getUserById } from '../getters/getUserById'
import transformUsersToContacts from '../../../utils/transdusers/transformUsersToContacts'

export const emitContacts = async (userId: string, message: string = '') => {
  const userData = await getUserById(userId)
  const matchedUsers = await UserModel.find({ _id: { $in: userData?.contacts } })
  const transformedContacts = transformUsersToContacts(matchedUsers)
  if (!userData?.socketId) return
  io.to(userData.socketId).emit(SocketActions.GET_CONTACTS, transformedContacts, message)
}

export default emitContacts
