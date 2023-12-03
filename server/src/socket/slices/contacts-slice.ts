import { UserModel } from '../../models'
import { SocketInstanceType, SocketActions, SocketActionsPayload, KRoomUser, NotificationMessage } from '../../@types'
import { transformUsersData } from '../../utils'
import { emitSearchedContacts, emitContactsToUser } from '../helpers'

const ObjectIdType = require('mongoose').Types.ObjectId

export const contactsSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data
  socket.on(SocketActions.SEARCH_CONTACT, async ({ value }: SocketActionsPayload['searchContact']) => {
    let type = 'name'
    let validSearch = true
    if (value.includes('#')) {
      value = value.substring(1)
      ObjectIdType.isValid(value) ? (type = 'id') : (validSearch = false)
    }
    if (value.includes('@')) {
      type = 'email'
      value = value.split('@')[0]
    }
    if (!value) validSearch = false
    const $regex = new RegExp(value, 'i')
    const searchTypeMap: Record<
      string,
      Record<
        string,
        | {
            $regex: RegExp
          }
        | string
      >
    > = {
      name: { username: { $regex } },
      email: { email: { $regex } },
      id: { _id: value }
    }
    const searchType = searchTypeMap[type]
    if (!searchType) validSearch = false
    let searchedUsers: KRoomUser[] = []
    if (validSearch) {
      const users = await UserModel.find(searchType)
      searchedUsers = transformUsersData(users)
    }
    emitSearchedContacts(socket.id, searchedUsers)
  })

  socket.on(SocketActions.SAVE_CONTACT, async ({ interlocutorId }: SocketActionsPayload['saveContact']) => {
    await UserModel.updateOne({ _id: userId }, { $addToSet: { contacts: interlocutorId } })
    emitContactsToUser(userId, NotificationMessage.userAddedToContacts)
  })

  socket.on(SocketActions.DELETE_CONTACT, async ({ deletingUserId }: SocketActionsPayload['deleteContact']) => {
    await UserModel.updateOne({ _id: userId }, { $pull: { contacts: deletingUserId } })
    emitContactsToUser(userId, NotificationMessage.userRemovedFromContacts)
  })
}
