import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { addChatRoomToUserById } from '../../user/lib/user-persistence'
import { ChatRoomModel } from '../chat-rooms.model'

export const ensureFavoritesChatRoom = async (userId: string) => {
  const roomId = stringifyMongoId(userId)

  await ChatRoomModel.findOneAndUpdate(
    { _id: roomId },
    {
      $setOnInsert: {
        adminId: userId,
        avatarId: null,
        chatKind: 'favorites',
        chatName: '',
        createdAt: Date.now(),
        messages: [],
        pinnedMessageId: null,
        users: [userId]
      }
    },
    {
      new: true,
      setDefaultsOnInsert: true,
      upsert: true
    }
  )

  await addChatRoomToUserById(roomId, userId)

  return roomId
}
