import { UserModel } from '../../models/user.model'
import { ChatRoom } from '../../../../types'
import getRoomForSaveToUser from './getRoomForSaveToUser'

export const setRoomToUsers = async (room: ChatRoom) => {
  return await Promise.all(
    room.users.map(async (user) => {
      const chatRooms = user.id ? await getRoomForSaveToUser(user.id, room) : []
      await UserModel.updateOne({ _id: user.id }, { $addToSet: { chatRooms } })
    })
  )
}

export default setRoomToUsers
