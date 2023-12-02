import { UserModel } from '../../../models'

export const setRoomToUsers = async (roomId: string, users: Array<string>) => {
  return await Promise.all(
    users.map(async (userId) => {
      await UserModel.updateOne({ _id: userId }, { $push: { chatRooms: roomId } })
    })
  )
}
