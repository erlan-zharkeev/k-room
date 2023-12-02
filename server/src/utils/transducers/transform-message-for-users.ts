import { DBMessage, Message, MessageStatus } from '../../@types'

export const transformMessageForUsers = (message: DBMessage, userId: string): Message => {
  const { _id, authorId, authorName, body, createdAt, usersMetaData, reactions, images, repliedMessage } = message
  const isSelf = authorId === userId
  const readBySomeone = usersMetaData.some((data) => data.status === MessageStatus.read)
  const status = isSelf && readBySomeone ? MessageStatus.read : usersMetaData.find((user) => user.id === userId)?.status

  return {
    id: String(_id),
    authorId,
    authorName,
    body,
    createdAt,
    reactions,
    images,
    status,
    isSelf,
    repliedMessage
  }
}
