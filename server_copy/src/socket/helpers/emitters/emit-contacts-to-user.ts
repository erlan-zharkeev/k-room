import { io } from '../../../app/server'
import type { EventGetContactsType, SocketActionsType } from 'common-types'
import { transformUsersToContacts } from '../../../utils'
import { getUserById } from '../getters'
import { UserModel } from 'entities/user'

export const emitContactsToUser = async (userId: string) => {
  const userData = await getUserById(userId)
  if (!userData || !userData.contacts || !userData?.socketId) return
  const contactIds = Object.keys(userData.contacts)
  const matchedUsers = await UserModel.find({ _id: { $in: contactIds } })
  const payload: EventGetContactsType = transformUsersToContacts(matchedUsers, userData?.contacts)
  io.to(userData.socketId).emit<SocketActionsType>('contacts-loaded', payload)
}
