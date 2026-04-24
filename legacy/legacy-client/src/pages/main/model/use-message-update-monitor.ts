import { Fragment, createElement, useEffect } from 'react'

import { IEventAddReaction, IEventMessageDelivered, IEventUpdateMessageStatus, SocketActionsType } from 'common'

import { useChatRoom } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'
import { useNotification } from 'src/shared/notification'
import { AppText } from 'src/shared/ui'

import { useMessage } from './use-message'
import { useSound } from './use-sound'

export const useMessageUpdateMonitor = () => {
  const { getById: getRoomById, mutate } = useChatRoom()
  const { getById, put, update } = useMessage()
  const { getNotification, openBrowserNotification } = useNotification()
  const { play } = useSound()

  const handleDeliveredMessage = async (payload: IEventMessageDelivered) => {
    const { roomId, message } = payload
    const existingMessage = getById(message.id)

    if (existingMessage) {
      await update(message.id, {
        ...message,
        status: 'delivered'
      })
    } else {
      await put(message)
      await mutate(roomId, (room) => {
        room.messages = Array.isArray(room.messages) ? room.messages : []

        if (room.messages[room.messages.length - 1] !== message.id) {
          room.messages.push(message.id)
        }
      })
    }

    if (payload.message.isSelf) return

    const incomeMessageNotification = getNotification({
      message: createElement(
        Fragment,
        null,
        createElement(AppText, { size: 'large', tag: 'p' }, message.authorName),
        createElement(AppText, null, message.body)
      ),
      messageType: 'info',
      placement: 'topRight'
    })

    incomeMessageNotification.open()
    openBrowserNotification({ message, icon: getRoomById(roomId)?.avatarId })
    play('message-delivered')
  }

  const updateMessageStatus = async (payload: IEventUpdateMessageStatus) => {
    await update(payload.messageId, { status: payload.status })
  }

  const handleMessageDeleted = () => {
    // TODO restore message deletion flow when backend payload is finalized.
  }

  const handleMessageReactionUpdate = (_payload: IEventAddReaction) => {
    // TODO restore reaction updates in the local message store.
  }

  useEffect(() => {
    socket.on<SocketActionsType>('message-deleted', handleMessageDeleted)
    socket.on<SocketActionsType>('message-delivered', handleDeliveredMessage)
    socket.on<SocketActionsType>('message-reaction-updated', handleMessageReactionUpdate)
    socket.on<SocketActionsType>('message-status-updated', updateMessageStatus)

    return () => {
      socket.off<SocketActionsType>('message-deleted', handleMessageDeleted)
      socket.off<SocketActionsType>('message-delivered', handleDeliveredMessage)
      socket.off<SocketActionsType>('message-reaction-updated', handleMessageReactionUpdate)
      socket.off<SocketActionsType>('message-status-updated', updateMessageStatus)
    }
  }, [getById, getNotification, getRoomById, mutate, openBrowserNotification, play, put, update])
}
