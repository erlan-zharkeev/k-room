import type {
  EventMessageDeleted,
  EventMessageDelivered,
  EventMessagesStatusUpdated,
  EventUpdateMessageStatus,
  EventUpdatedMessageReactions
} from 'global-shared'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'
import { useSocketEventListeners } from 'src/shared/api'

export const useMessageMonitor = () => {
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
      if (room.messages[room.messages.length - 1] !== message.id) {
        room.messages.push(message.id)
      }

      if (!message.isSelf && message.status === 'delivered') {
        room.unreadMessagesQuantity = (room.unreadMessagesQuantity ?? 0) + 1
      }
    })
  }

  const updateMessageStatus = async ({ roomId, messageId, status, userId }: EventUpdateMessageStatus) => {
    const shouldDecreaseUnreadMessagesQuantity = userId === user.value.id && status === 'read'

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
    const isReadStatusUpdate = status === 'read'

    await bulkUpdate(loadedMessageIds.map((id) => ({ id, changes: { status } })))

    if (isCurrentUserStatusUpdate && isReadStatusUpdate) {
      await decreaseUnreadMessagesQuantity(roomId, updatedMessagesQuantity)
    }
  }

  const handleMessageDeleted = async ({ messageId, roomId }: EventMessageDeleted) => {
    const message = getById(messageId)

    await remove(messageId)
    await mutateRoom(roomId, (room) => {
      room.messages = room.messages.filter((id) => id !== messageId)

      if (room.lastMessageId === messageId) {
        room.lastMessageId = room.messages[room.messages.length - 1] ?? null
      }
    })

    if (message?.status === 'delivered' && !message.isSelf) {
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
  const { initializeSocketEventListeners, disposeSocketEventListeners } = useSocketEventListeners([
    { action: 'message-deleted', handler: handleMessageDeleted },
    { action: 'message-delivered', handler: handleDeliveredMessage },
    { action: 'message-reaction-updated', handler: handleMessageReactionUpdate },
    { action: 'message-status-updated', handler: updateMessageStatus },
    { action: 'messages-status-updated', handler: updateMessagesStatus }
  ])

  return {
    initializeMessageMonitor: initializeSocketEventListeners,
    disposeMessageMonitor: disposeSocketEventListeners
  }
}
