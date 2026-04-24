import { UserModel } from 'src/modules/user'

export const setRoomToUsers = async (roomId: string, userIds: string[]) => {
  return Promise.all(
    userIds.map(async (userId) => {
      await UserModel.updateOne({ _id: userId }, { $push: { 'personal.chatRooms': roomId } })
    })
  )
}
