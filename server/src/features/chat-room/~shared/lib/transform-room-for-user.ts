import type { IChatRoom, IChatRoomSchema } from 'common-types'
import { UserModel } from 'entities/user'
import { ObjectId } from 'mongoose'

export const transformRoomForUser = async ({
  userId,
  room,
}: { userId: string; room: IChatRoomSchema }) => {
  const { chatName, authorId, messages, _id } = room as IChatRoomSchema & { _id: ObjectId }

  const usersAll = (room.users ?? []).map((id) => String(id))
  const selfId = String(userId)
  const otherUsers = usersAll.filter((id) => id !== selfId)

  const result: IChatRoom = {
    id: String(_id),
    authorId,
    chatName,
    users: otherUsers,
    messages,
  }

  if (otherUsers.length === 1) {
    const interlocutor = await UserModel.findById(otherUsers[0], { 'public.username': 1 }).lean()
    if (interlocutor?.public?.username) result.chatName = interlocutor.public.username
  }

  return result
}