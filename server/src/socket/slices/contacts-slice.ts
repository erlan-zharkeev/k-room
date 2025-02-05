import { UserModel } from '../../models'
import { SocketInstanceType, SocketActions, SocketActionsPayload, KRoomUser, NotificationMessage, InteractionType } from '../../@types'
import { transformUsersData } from '../../utils'
import { emitSearchedContacts, emitContactsToUser, setUserStatus } from '../helpers'
import { io } from '../../server'

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
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: { [`contacts.${interlocutorId}`]: { id: interlocutorId, interactionType: InteractionType.default } }
      }
    );
    emitContactsToUser(userId, NotificationMessage.userAddedToContacts)
  })

  socket.on(SocketActions.DELETE_CONTACT, async ({ deletingUserId }: SocketActionsPayload['deleteContact']) => {
    await UserModel.updateOne(
      { _id: userId },
      { $unset: { [`contacts.${deletingUserId}`]: "" } }
    )
    emitContactsToUser(userId, NotificationMessage.userRemovedFromContacts)
  })

  socket.on(SocketActions.INTERLOCUTOR_PING, async () => {
    await setUserStatus(userId, true)
  })

  socket.on(SocketActions.UPDATE_CONTACT_INTERACTION_TYPE, async ({ contactId, interactionType }: SocketActionsPayload['updateInteractionType']) => {
    const selfContact = await UserModel.findOneAndUpdate(
      { _id: userId, [`contacts.${contactId}`]: { $exists: true } },
      {
        $set: { [`contacts.${contactId}.interactionType`]: interactionType }
      }
    );
    if (interactionType === InteractionType.invited) {
      const contactData = await UserModel.findOneAndUpdate(
        { _id: contactId },
        { $set: { [`contacts.${userId}`]: { id: userId, interactionType: InteractionType.inviteReceived } } }
      );
      if (contactData && selfContact) {
        const { id, username, email, online, avatarPath, lastSeen } = selfContact
        const payload: SocketActionsPayload['inviteReceived'] = { contactData: { id, username, email, online, avatarPath, lastSeen, interactionType: InteractionType.inviteReceived } }
        io.to(contactData.socketId).emit(SocketActions.INVITE_RECEIVED, payload)
      }
    }
    io.to(socket.id).emit(SocketActions.UPDATE_CONTACT_INTERACTION_TYPE_SUCCESS)
  });
}