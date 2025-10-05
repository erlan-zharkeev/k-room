import { UserModel } from 'entities/user'

export const setRoomToUsers = async (roomId: string, userIds: string[]) => {
  return await Promise.all(
    userIds.map(async (userId) => {
      console.log(roomId, 'room id', userId)
      await UserModel.updateOne({ _id: userId }, { $push: { 'personal.chatRooms': roomId } }
      )
    })
  )
}
