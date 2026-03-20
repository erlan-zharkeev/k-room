import { UserModel } from 'entities/user'

export const setRoomToUsers = async (roomId: string, userIds: string[]) => {
  return await Promise.all(
    userIds.map(async (userId) => {
      await UserModel.updateOne({ _id: userId }, { $push: { 'personal.chatRooms': roomId } }
      )
    })
  )
}
