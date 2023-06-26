import { DBMessage, Message } from '../../../../types'

export const transformMessageForUsers = (message: DBMessage, userId: string): Message => {
  const { _id, authorId, authorName, body, createdAt, usersMetaData, reactions, images } = message
  const status = usersMetaData.find((user) => user.id === userId)?.status
  return {
    id: String(_id),
    authorId,
    authorName,
    body,
    createdAt,
    reactions,
    images,
    status,
    isSelf: authorId === userId
  }
}
