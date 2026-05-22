import { useEffect, useRef } from 'react'

import { EventLoadRoomMessages, EventRoomMessagesLoaded, SocketActions } from 'common'

import { ROOM_MESSAGES_PAGE_LIMIT } from './room-messages/constants.ts'

import { useChatRoom } from 'src/entities/chat-room'

import { socket } from 'src/shared/api'

import { useMessage } from './use-message'

export const useLoadRoomMessages = () => {
  const { selectedChatRoom } = useChatRoom()
  const { bulkPut } = useMessage()
  const nextBeforeCreatedAtRef = useRef<Record<string, number | undefined>>({})
  const hasMoreMessagesRef = useRef<Record<string, boolean>>({})

  const loadRoomMessages = (payload: EventLoadRoomMessages) => {
    socket.emit<SocketActions>('load-room-messages', payload)
  }

  const loadOlderMessages = (roomId: string) => {
    const beforeCreatedAt = nextBeforeCreatedAtRef.current[roomId]
    const hasMoreMessages = hasMoreMessagesRef.current[roomId] ?? true

    if (!beforeCreatedAt || !hasMoreMessages) return

    loadRoomMessages({
      roomId,
      limit: ROOM_MESSAGES_PAGE_LIMIT,
      beforeCreatedAt
    })
  }

  const handleRoomMessagesLoaded = async ({
    roomId,
    messages,
    hasMore,
    nextBeforeCreatedAt
  }: EventRoomMessagesLoaded) => {
    hasMoreMessagesRef.current[roomId] = hasMore
    nextBeforeCreatedAtRef.current[roomId] = nextBeforeCreatedAt

    if (!messages.length) return

    await bulkPut(messages)
  }

  useEffect(() => {
    socket.on<SocketActions>('room-messages-loaded', handleRoomMessagesLoaded)

    return () => {
      socket.off<SocketActions>('room-messages-loaded', handleRoomMessagesLoaded)
    }
  }, [])

  useEffect(() => {
    if (!selectedChatRoom?.id) return

    loadRoomMessages({
      roomId: selectedChatRoom.id,
      limit: ROOM_MESSAGES_PAGE_LIMIT
    })
  }, [selectedChatRoom?.id])

  return { loadRoomMessages, loadOlderMessages }
}
