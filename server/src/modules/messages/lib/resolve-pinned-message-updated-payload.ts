import type { EventPinnedMessageUpdated } from 'global-shared'

import { MessageModel } from '../messages.model'
import type { MessageDocument } from '../messages.types'

import { transformMessageForUser } from './transform-message-for-user'

export const resolvePinnedMessageUpdatedPayload = async (
  userId: string,
  roomId: string,
  pinnedMessageId: string | null
): Promise<EventPinnedMessageUpdated> => {
  if (!pinnedMessageId) {
    return {
      roomId,
      pinnedMessageId: null,
      pinnedMessage: null
    }
  }

  const pinnedMessage = await MessageModel.findOne({
    _id: pinnedMessageId,
    deletedForUserIds: { $ne: userId }
  })
    .select('-__v')
    .lean<MessageDocument>()

  return {
    roomId,
    pinnedMessageId: pinnedMessage ? pinnedMessageId : null,
    pinnedMessage: pinnedMessage ? transformMessageForUser(pinnedMessage, userId) : null
  }
}
