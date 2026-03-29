import type { IDBMessage, IMessage } from 'common'

export const transformMessageForUser = (message: IDBMessage, userId: string): IMessage => {
  const { _id, authorId, authorName, body, createdAt, usersMetaData, reactions, images, repliedMessage } = message
  const isSelf = authorId === userId
  const readBySomeone = usersMetaData.some((data) => data.status === 'read')
  const status = isSelf
    ? readBySomeone
      ? 'read'
      : usersMetaData.find((user) => user.id === userId)?.status
    : usersMetaData.find((user) => user.id === userId)?.status

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
