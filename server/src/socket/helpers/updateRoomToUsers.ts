import { UserModel } from '../../models/user.model'
import { ChatRoom } from '../../../../types'

export const updateRoomToUsers = async (payload: { room: ChatRoom }) => {
  const { room } = payload
  return await Promise.all(
    room.users.map(
      async (user) =>
        await UserModel.updateOne(
          { _id: user.id, 'chatRooms.roomId': room.roomId },
          { $set: { 'chatRooms.$.chatName': room.chatName, 'chatRooms.$.avatar': room.avatar } },
          { new: true }
        )
    )
  )
}

export default updateRoomToUsers
