import { MessageModel } from '../messages.model'
import type { MessageDocument } from '../messages.types'

export const countUnreadMessagesByIds = (userId: string, messageIds: string[]) => {
  if (!messageIds.length) return 0

  return MessageModel.countDocuments({
    _id: { $in: messageIds },
    authorId: { $ne: userId },
    deletedForUserIds: { $ne: userId },
    usersMetaData: {
      $elemMatch: {
        id: userId,
        status: 'delivered'
      }
    }
  })
}

export const loadMessageById = (messageId: string) => {
  return MessageModel.findById(messageId).select('-__v').lean<MessageDocument>()
}

export const deleteMessagesByIds = (messageIds: string[]) => {
  return MessageModel.deleteMany({ _id: { $in: messageIds } }).exec()
}
