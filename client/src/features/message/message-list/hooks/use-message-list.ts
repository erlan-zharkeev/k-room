import { useEffect, useRef } from 'react'

import { IEventChangeMessageStatus, SocketActionsType } from 'common-types'

import { useSettings } from 'src/entities/settings'

import { socket } from 'src/shared/api'

import { MESSAGE_LIST_SCROLL_SAVE_DEBOUNCE_MS, MessageListItemType } from '../config'

export const useMessageList = ({
  roomId,
  items
}: {
  roomId: string
  items: MessageListItemType[]
}) => {
  const pendingReadIdsRef = useRef<Set<string>>(new Set())
  const saveScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingFirstVisibleItemIdRef = useRef<string | null>(null)
  const { setByPath, messageScrollByRoom } = useSettings()

  useEffect(() => {
    pendingReadIdsRef.current.clear()
    pendingFirstVisibleItemIdRef.current = null

    return () => {
      if (saveScrollTimeoutRef.current) {
        clearTimeout(saveScrollTimeoutRef.current)
      }
    }
  }, [roomId])

  const handleVisibleRangeChange = ({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
    const visibleItems = items.slice(startIndex, endIndex + 1)
    const firstVisibleMessage = visibleItems.find((item) => item.type === 'message')

    if (firstVisibleMessage?.type === 'message') {
      const nextFirstVisibleItemId = firstVisibleMessage.message.id
      const savedFirstVisibleItemId = messageScrollByRoom[roomId]?.firstVisibleItemId

      if (
        savedFirstVisibleItemId !== nextFirstVisibleItemId &&
        pendingFirstVisibleItemIdRef.current !== nextFirstVisibleItemId
      ) {
        pendingFirstVisibleItemIdRef.current = nextFirstVisibleItemId

        if (saveScrollTimeoutRef.current) {
          clearTimeout(saveScrollTimeoutRef.current)
        }

        saveScrollTimeoutRef.current = setTimeout(() => {
          setByPath(`messageScrollByRoom.${roomId}.firstVisibleItemId`, nextFirstVisibleItemId)
          pendingFirstVisibleItemIdRef.current = null
        }, MESSAGE_LIST_SCROLL_SAVE_DEBOUNCE_MS)
      }
    }

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
