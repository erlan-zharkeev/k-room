import { UserModel } from './../../models/user.model'
import { io } from './../../server'
import transformUsersToContacts from './../../utils/transformUsersToContacts'
import { SocketActions } from './../../../../types'
import getUserById from './getUserById'

export const emitContacts = async (userId: string, message?: string) => {
  const userData = await getUserById(userId)
  const matchedUsers = await UserModel.find({ _id: { $in: userData?.contacts } })
  const transformedContacts = transformUsersToContacts(matchedUsers)
  if (userData?.socketId) io.to(userData.socketId).emit(SocketActions.GET_CONTACTS, transformedContacts, message)
}

export default emitContacts
