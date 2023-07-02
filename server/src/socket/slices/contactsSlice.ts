import { UserModel } from '../../models/user.model'
import { SuccessMessages } from '../../types/Messages'
import { transformUsersData } from '../../utils/transformUserData'
import { SocketActions, SocketActionsPayload, User } from '../../../../types'
import { emitSearchedContacts, emitContactsToUser } from '../helpers/emitters'
import { SocketInstanceType } from '../../types/SocketInstanceType'

const ObjectIdType = require('mongoose').Types.ObjectId

export const contactsSlice = (socket: SocketInstanceType) => {
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
    let searchedUsers: User[] = []
    if (validSearch) {
      const users = await UserModel.find(searchType)
      searchedUsers = transformUsersData(users)
    }
    emitSearchedContacts(socket.id, searchedUsers)
  })

  socket.on(SocketActions.SAVE_CONTACT, async ({ userId, interlocutorId }: SocketActionsPayload['saveContact']) => {
    await UserModel.updateOne({ _id: userId }, { $addToSet: { contacts: interlocutorId } })
    emitContactsToUser(userId, SuccessMessages.userAddedToContacts)
  })

  socket.on(
    SocketActions.DELETE_CONTACT,
    async ({ currentUserId, deletingUserId }: SocketActionsPayload['deleteContact']) => {
      await UserModel.updateOne({ _id: currentUserId }, { $pull: { contacts: deletingUserId } })
      emitContactsToUser(currentUserId, SuccessMessages.userRemovedFromContacts)
    }
  )
}
