import { UserModel } from '../../../models'
import { io } from '../../../server'
import { SocketActionsType, IEventGetContacts } from '../../../@types'
import { transformUsersToContacts } from '../../../utils'
import { getUserById } from '../getters'

export const emitContactsToUser = async (userId: string) => {
  const userData = await getUserById(userId)
  if (!userData || !userData.contacts) return
  const contactIds = Object.keys(userData.contacts)
  const matchedUsers = await UserModel.find({ _id: { $in: contactIds } })
  const contacts = transformUsersToContacts(matchedUsers, userData?.contacts)
  if (!userData?.socketId) return
  const payload: IEventGetContacts = { contacts }
  io.to(userData.socketId).emit<SocketActionsType>('get-contacts', payload)
}
