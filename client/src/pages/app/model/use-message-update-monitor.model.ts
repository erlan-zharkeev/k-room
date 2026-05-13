import type {
  IEventMessageDeleted,
  IEventMessageDelivered,
  IEventUpdateMessageStatus,
  IEventUpdatedMessageReactions,
  SocketActionsType
} from 'global-shared'
import { onBeforeUnmount } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { socket } from 'src/shared/api'

export const useMessageUpdateMonitor = () => {
  const { mutate: mutateRoom } = useChatRoom()
  const { mutate: mutateMessage, put, remove, update } = useMessage()

  const handleDeliveredMessage = async ({ roomId, message }: IEventMessageDelivered) => {
    await put(message)
    await mutateRoom(roomId, (room) => {
      room.messages = Array.isArray(room.messages) ? room.messages : []
      room.lastMessageId = message.id

      if (room.messages[room.messages.length - 1] !== message.id) {
        room.messages.push(message.id)
      }
    })
  }

  const updateMessageStatus = async ({ messageId, status }: IEventUpdateMessageStatus) => {
    await update(messageId, { status })
  }

  const handleMessageDeleted = async ({ messageId, roomId }: IEventMessageDeleted) => {
    await remove(messageId)
    await mutateRoom(roomId, (room) => {
      room.messages = room.messages.filter((id) => id !== messageId)

      if (room.lastMessageId === messageId) {
        room.lastMessageId = room.messages[room.messages.length - 1] ?? null
      }
    })
  }

  const handleMessageReactionUpdate = async ({ messageId, reaction }: IEventUpdatedMessageReactions) => {
    await mutateMessage(messageId, (message) => {
      const reactions = message.reactions ?? []
      const isExistingReaction = reactions.some(
        ({ authorId, glyphKey }) => authorId === reaction.authorId && glyphKey === reaction.glyphKey
      )

      if (isExistingReaction) return

      message.reactions = [...reactions, reaction]
    })
  }

  const initializeMessageUpdateMonitor = () => {
    socket.on<SocketActionsType>('message-deleted', handleMessageDeleted)
    socket.on<SocketActionsType>('message-delivered', handleDeliveredMessage)
    socket.on<SocketActionsType>('message-reaction-updated', handleMessageReactionUpdate)
    socket.on<SocketActionsType>('message-status-updated', updateMessageStatus)
  }

  const disposeMessageUpdateMonitor = () => {
    socket.off<SocketActionsType>('message-deleted', handleMessageDeleted)
    socket.off<SocketActionsType>('message-delivered', handleDeliveredMessage)
    socket.off<SocketActionsType>('message-reaction-updated', handleMessageReactionUpdate)
    socket.off<SocketActionsType>('message-status-updated', updateMessageStatus)
  }

  onBeforeUnmount(disposeMessageUpdateMonitor)

  return {
    initializeMessageUpdateMonitor,
    disposeMessageUpdateMonitor
  }
}
