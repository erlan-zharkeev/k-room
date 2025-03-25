import { EventMessageDelivered } from 'common-types'
import { useMemo } from 'react'
import { MessageNotification } from 'src/entities/message'
import { UseNotification } from 'src/entities/notification'
import { useSettings } from 'src/entities/settings'
import { useSystem } from 'src/entities/system'
import { AppLogoIcon } from 'src/shared/assets'
import { sound, useTypedSelector } from 'src/shared/lib'

export const useChatRooms = () => {
  const { selectedChatRoomId, soundOn } = useSettings()
  const { allowAudioContext } = useSystem()

  const { chatRooms } = useTypedSelector((state) => state.chatRooms)

  const unreadMessagesCount = useMemo(() => {
    return chatRooms.reduce((total, room) => {
      return total + room.messages.filter((message) => message.status === 'delivered' && !message.isSelf).length
    }, 0)
  }, [chatRooms])

  const selectedChatRoom = useMemo(() => {
    return chatRooms.find((room) => room.id === selectedChatRoomId) || null
  }, [chatRooms, selectedChatRoomId])

  type UpdateChatMessagePayload = EventMessageDelivered & {
    notifications: UseNotification
  }

  const updateChatMessage = (payload: UpdateChatMessagePayload) => {
    const { message, roomId, notifications } = payload
    if (!message.isSelf) {
      const incomeMessageNotification = notifications.getNotification({
        message: MessageNotification(message),
        messageType: 'info'
      })
      incomeMessageNotification.open()
      const room = chatRooms.find((room) => room.id === roomId)
      const icon = room && room.avatarPath ? room.avatarPath : AppLogoIcon
      new Notification(message.authorName, { body: message.body, icon })
      if (soundOn && allowAudioContext) sound('message-delivered').play()
    }
  }

  return {
    chatRooms,
    unreadMessagesCount,
    selectedChatRoom,
    updateChatMessage
  }
}
