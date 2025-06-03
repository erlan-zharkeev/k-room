import { useMemo } from 'react'

import { useSettings } from 'src/entities/settings'

import { useTypedSelector } from 'src/shared/lib'

export const useChatRooms = () => {
  const { chatRooms, repliedMessageData, messageInputData } = useTypedSelector((state) => state.chatRooms)

  const { selectedChatRoomId } = useSettings()

  const getRoomById = (id: string) => {
    return chatRooms.find((room) => room.id === id)
  }

  const getPersonalRoomByContactId = (id: string) =>
    chatRooms.find((room) => {
      return room.users.length === 1 && room.users[0] === id
    })

  const selectedChatRoom = useMemo(() => {
    return chatRooms.find((room) => room.id === selectedChatRoomId)
  }, [chatRooms, selectedChatRoomId])

  const isSelectedRoomPrivate = useMemo(
    () => Boolean(selectedChatRoom && selectedChatRoom.users.length > 0),
    [selectedChatRoom]
  )

  const haveMessageToReply = useMemo(() => Boolean(repliedMessageData.id), [repliedMessageData])

  const unreadMessageQuantity = useMemo(() => {
    return chatRooms.reduce((total, room) => {
      return total + room.messages.filter((message) => message.status === 'delivered' && !message.isSelf).length
    }, 0)
  }, [chatRooms])

  return {
    getRoomById,
    getPersonalRoomByContactId,
    chatRooms,
    unreadMessageQuantity,
    selectedChatRoom,
    isSelectedRoomPrivate,
    repliedMessageData,
    haveMessageToReply,
    messageInputData
  }
}
