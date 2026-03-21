import { useEffect, useRef } from 'react'

import { IEventChangeMessageStatus, SocketActionsType } from 'common-types'

import { socket } from 'src/shared/api'

import { MessageListItemType } from '../config'

export const useMessageList = ({ roomId, items }: { roomId: string; items: MessageListItemType[] }) => {
  const pendingReadIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    pendingReadIdsRef.current.clear()
  }, [roomId])

  const handleVisibleRangeChange = ({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
    const visibleItems = items.slice(startIndex, endIndex + 1)

    visibleItems.forEach((item) => {
      if (item.type !== 'message') return

      const { message } = item
      const { id: messageId } = message
      const messageRead = message.status === 'read'
      const isSelfMessage = Boolean(message.isSelf)
      const alreadyRequested = pendingReadIdsRef.current.has(messageId)

      if (messageRead) {
        pendingReadIdsRef.current.delete(messageId)
        return
      }
      if (isSelfMessage || alreadyRequested) return

      const payload: IEventChangeMessageStatus = {
        roomId,
        messageId,
        status: 'read'
      }

      pendingReadIdsRef.current.add(messageId)
      socket.emit<SocketActionsType>('change-message-status', payload)
    })
  }

  return { handleVisibleRangeChange }
}
