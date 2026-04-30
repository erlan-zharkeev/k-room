import type { IEventSendMessage, IMessage, SocketActionsType } from 'global-shared'
import { ref } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useUser } from 'src/entities/user'
import { socket } from 'src/shared/api'
import { generateUUIDv4 } from 'src/shared/lib'

import { useMessage } from './use-message'

export const useSendMessage = () => {
  const { mutate } = useChatRoom()
  const { put } = useMessage()
  const { user } = useUser()
  const messageText = ref('')

  const sendMessage = async (roomId: string) => {
    const body = messageText.value.trim()

    if (!body || !user.value.id) return

    const message: IMessage = {
      id: generateUUIDv4(),
      authorId: user.value.id,
      authorNickname: user.value.nickname,
      body,
      createdAt: Date.now(),
      isSelf: true,
      status: 'delivered',
      reactions: [],
      images: []
    }
    const payload: IEventSendMessage = {
      roomId,
      message
    }

    await put(message)
    await mutate(roomId, (room) => {
      room.messages = Array.isArray(room.messages) ? room.messages : []
      room.lastMessageId = message.id
      room.messages.push(message.id)
    })

    socket.emit<SocketActionsType>('send-message', payload)
    messageText.value = ''
  }

  return {
    messageText,
    sendMessage
  }
}
