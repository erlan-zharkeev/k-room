import type { IChatRoom, IChatRoomSchema } from 'common-types'
import { ObjectId } from 'mongoose'

export const transformRoomForUser = ({
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
    lastMessageId: messages[messages.length - 1] ?? null,
    users: otherUsers,
    messages,
  }

  return result
}
