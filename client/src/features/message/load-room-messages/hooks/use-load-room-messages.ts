import { useEffect } from 'react'
import { useRef } from 'react'

import { IEventLoadRoomMessages, IEventRoomMessagesLoaded, SocketActionsType } from 'common-types'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'

import { socket } from 'src/shared/api'

import { ROOM_MESSAGES_PAGE_LIMIT } from '../config'

export const useLoadRoomMessages = () => {
  const { selectedChatRoom } = useChatRoom()
  const { bulkPutMessages } = useMessage()
  const nextBeforeCreatedAtRef = useRef<Record<string, string | undefined>>({})
  const hasMoreMessagesRef = useRef<Record<string, boolean>>({})

  const loadRoomMessages = (payload: IEventLoadRoomMessages) => {
    socket.emit<SocketActionsType>('load-room-messages', payload)
  }

  const handleRoomMessagesLoaded = async ({
    roomId,
    messages,
    hasMore,
    nextBeforeCreatedAt
  }: IEventRoomMessagesLoaded) => {
    hasMoreMessagesRef.current[roomId] = hasMore
    nextBeforeCreatedAtRef.current[roomId] = nextBeforeCreatedAt

    if (!messages.length) return

    await bulkPutMessages(messages)
  }

  useEffect(() => {
    socket.on<SocketActionsType>('room-messages-loaded', handleRoomMessagesLoaded)

    return () => {
      socket.off<SocketActionsType>('room-messages-loaded', handleRoomMessagesLoaded)
    }
  }, [])

  useEffect(() => {
    if (!selectedChatRoom?.id) return

    loadRoomMessages({
      roomId: selectedChatRoom.id,
      limit: ROOM_MESSAGES_PAGE_LIMIT
    })
  }, [selectedChatRoom?.id])

  const getNextBeforeCreatedAt = (roomId: string) => nextBeforeCreatedAtRef.current[roomId]
  const getHasMoreMessages = (roomId: string) => hasMoreMessagesRef.current[roomId] ?? true

  return { loadRoomMessages, getNextBeforeCreatedAt, getHasMoreMessages }
}
