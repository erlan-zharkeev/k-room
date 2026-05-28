import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { MessageModel } from '../messages.model'

export const resolveVisibleMessageIds = async (userId: string, messageIds: string[]) => {
  if (!messageIds.length) return []

  const visibleMessages = await MessageModel.find({
    _id: { $in: messageIds },
    deletedForUserIds: { $ne: userId }
  })
    .select('_id')
    .lean<Array<{ _id: string }>>()
  const visibleMessageIds = new Set(visibleMessages.map(({ _id }) => stringifyMongoId(_id)))

  return messageIds.filter((id) => visibleMessageIds.has(id))
}
