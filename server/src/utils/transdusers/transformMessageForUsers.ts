import { DBMessage, Message } from '../../../../types'

export const transformMessageForUsers = (message: DBMessage, userId: string): Message => {
  const { _id, authorId, authorName, body, createdAt, status, reactions, images } = message
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
