import { getRoomOtherUserIds } from 'global-shared'
import uniq from 'lodash/uniq'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { ChatRoomModel } from '../../chat-rooms/chat-rooms.model'
import { UserModel } from '../user.model'

export const resolveUserRelatedRecipientIds = async (userId: string) => {
  const [contacts, rooms] = await Promise.all([
    UserModel.find({ [`personal.contacts.${userId}`]: { $exists: true } }, { _id: 1 }).lean(),
    ChatRoomModel.find({ users: userId }, { users: 1 }).lean()
  ])

  return uniq([
    ...contacts.map((contact) => stringifyMongoId(contact._id)),
    ...rooms.flatMap((room) => getRoomOtherUserIds(room, userId))
  ])
}
