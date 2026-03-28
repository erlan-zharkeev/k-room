import { IDBMessage, IEventLoadRoomMessages, IEventRoomMessagesLoaded } from 'common'

import { transformMessageForUser } from 'src/features/message/~shared'

import { ChatRoomModel } from 'src/entities/chat-room'
import { MessageModel } from 'src/entities/message'

export const loadRoomMessages = async (
  userId: string,
  payload: IEventLoadRoomMessages
): Promise<IEventRoomMessagesLoaded | null> => {
  const { roomId, limit, beforeCreatedAt } = payload
  const room = await ChatRoomModel.findOne({ _id: roomId, users: userId }).select('messages').lean()

  if (!room) return null

  const query = beforeCreatedAt
    ? { _id: { $in: room.messages }, createdAt: { $lt: beforeCreatedAt } }
    : { _id: { $in: room.messages } }

  const messages = await MessageModel.find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .select('-__v')
    .lean<IDBMessage[]>()

  const hasMore = messages.length > limit
  const page = hasMore ? messages.slice(0, limit) : messages
  const normalizedMessages = page.reverse().map((message) => transformMessageForUser(message, userId))

  return {
    roomId,
    messages: normalizedMessages,
    hasMore,
    nextBeforeCreatedAt: normalizedMessages[0]?.createdAt
  }
}
