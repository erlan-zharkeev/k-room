import { useMemo } from 'react'

import { useSettings } from 'src/entities/settings'

import { useTypedSelector } from 'src/shared/lib'

export const useChatRooms = () => {
  const { selectedChatRoomId } = useSettings()

  const { chatRooms } = useTypedSelector((state) => state.chatRooms)

  const unreadMessageQuantity = useMemo(() => {
    return chatRooms.reduce((total, room) => {
      return total + room.messages.filter((message) => message.status === 'delivered' && !message.isSelf).length
    }, 0)
  }, [chatRooms])

  const selectedChatRoom = useMemo(() => {
    return chatRooms.find((room) => room.id === selectedChatRoomId) ?? null
  }, [chatRooms, selectedChatRoomId])

  const getRoomById = (id: string) => {
    return chatRooms.find((room) => room.id === id)
  }

  return {
    chatRooms,
    unreadMessageQuantity,
    selectedChatRoom,
    getRoomById
  }
}
