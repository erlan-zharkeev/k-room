import {
  type EventMessageDeleted,
  type EventMessageDelivered,
  type EventMessagesStatusUpdated,
  type EventPinnedMessageUpdated,
  type EventUpdateMessageStatus,
  type EventUpdatedMessageReactions,
  isMessageReadStatus,
  isMessageStatusDelivered
} from 'global-shared'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'

export const useMessageSync = () => {
  const { mutate: mutateRoom } = useChatRoom()
  const { bulkUpdate, getById, messageById, mutate: mutateMessage, put, remove, update } = useMessage()
  const { user } = useUser()

  const decreaseUnreadMessagesQuantity = async (roomId: string, quantity = 1) => {
    await mutateRoom(roomId, (room) => {
      room.unreadMessagesQuantity = Math.max(0, (room.unreadMessagesQuantity ?? 0) - quantity)
    })
  }

  const handleDeliveredMessage = async ({ roomId, message }: EventMessageDelivered) => {
    await put(message)
    await mutateRoom(roomId, (room) => {
      const { messages } = room

      if (messages[messages.length - 1] !== message.id) {
        messages.push(message.id)
      }

      if (!message.isSelf && isMessageStatusDelivered(message.status)) {
        room.unreadMessagesQuantity = (room.unreadMessagesQuantity ?? 0) + 1
      }
    })
  }

  const updateMessageStatus = async ({ roomId, messageId, status, userId }: EventUpdateMessageStatus) => {
    const shouldDecreaseUnreadMessagesQuantity = userId === user.value.id && isMessageReadStatus(status)

    await update(messageId, { status })

    if (shouldDecreaseUnreadMessagesQuantity) {
      await decreaseUnreadMessagesQuantity(roomId)
    }
  }

  const updateMessagesStatus = async ({
    roomId,
    messageIds,
    status,
    userId,
    updatedMessagesQuantity
  }: EventMessagesStatusUpdated) => {
    const loadedMessageIds = messageIds.filter((messageId) => messageById.value.has(messageId))
    const isCurrentUserStatusUpdate = userId === user.value.id
    const isReadStatusUpdate = isMessageReadStatus(status)

    await bulkUpdate(loadedMessageIds.map((id) => ({ id, changes: { status } })))

    if (isCurrentUserStatusUpdate && isReadStatusUpdate) {
      await decreaseUnreadMessagesQuantity(roomId, updatedMessagesQuantity)
    }
  }

  const handleMessageDeleted = async ({ messageId, roomId }: EventMessageDeleted) => {
    const message = getById(messageId)

    await remove(messageId)
    await mutateRoom(roomId, (room) => {
      const messages = room.messages.filter((id) => id !== messageId)

      room.messages = messages

      if (room.lastMessageId === messageId) {
        room.lastMessageId = messages[messages.length - 1] ?? null
      }

      if (room.pinnedMessageId === messageId) {
        room.pinnedMessageId = null
      }
    })

    const hasDeletedMessage = Boolean(message)
    const isDeletedDeliveredMessage = message ? isMessageStatusDelivered(message.status) : false
    const isDeletedMessageFromContact = message ? !message.isSelf : false
    const shouldDecreaseUnreadMessagesQuantity =
      hasDeletedMessage && isDeletedDeliveredMessage && isDeletedMessageFromContact

    if (shouldDecreaseUnreadMessagesQuantity) {
      await decreaseUnreadMessagesQuantity(roomId)
    }
  }

  const handleMessageReactionUpdate = async ({ messageId, reaction }: EventUpdatedMessageReactions) => {
    await mutateMessage(messageId, (message) => {
      const reactions = message.reactions ?? []
      const isExistingReaction = reactions.some(
        ({ authorId, glyphKey }) => authorId === reaction.authorId && glyphKey === reaction.glyphKey
      )

      if (isExistingReaction) return

      message.reactions = [...reactions, reaction]
    })
  }

  const handlePinnedMessageUpdated = async ({ pinnedMessage, pinnedMessageId, roomId }: EventPinnedMessageUpdated) => {
    if (pinnedMessage) {
      await put(pinnedMessage)
    }

    await mutateRoom(roomId, (room) => {
      room.pinnedMessageId = pinnedMessageId
    })
  }

  return {
    handleDeliveredMessage,
    handleMessageDeleted,
    handleMessageReactionUpdate,
    handlePinnedMessageUpdated,
    updateMessageStatus,
    updateMessagesStatus
  }
}
