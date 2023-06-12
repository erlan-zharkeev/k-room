import { UserModel } from '../../models/user.model'
import { ChatRoom } from '../../../../types'
import getRoomForSaveToUser from './getRoomForSaveToUser'

export const setRoomToUsers = async (payload: { room: ChatRoom; blockedFor: string }) => {
  return await Promise.all(
    payload.room.users.map(async (user) => {
      const blocked = user.id === payload.blockedFor
      const chatRooms = user.id ? await getRoomForSaveToUser(user.id, payload.room, blocked) : []
      await UserModel.updateOne({ _id: user.id }, { $addToSet: { chatRooms } })
    })
  )
}

export default setRoomToUsers
