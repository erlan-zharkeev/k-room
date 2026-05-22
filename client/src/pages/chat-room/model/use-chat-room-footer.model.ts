import type { EventSendMessage, Message, SocketActions } from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'
import { socket } from 'src/shared/api'

export const useChatRoomFooter = () => {
  const { mutate } = useChatRoom()
  const { put } = useMessage()
  const { user } = useUser()
  const messageText = ref('')
  const isSendDisabled = computed(() => !messageText.value.trim() || !user.value.id)

  const sendMessage = async (roomId: string) => {
    const body = messageText.value.trim()

    if (!body || !user.value.id) return

    const message: Message = {
      id: uuidv4(),
      authorId: user.value.id,
      authorNickname: user.value.nickname,
      body,
      createdAt: Date.now(),
      isSelf: true,
      status: 'sending',
      reactions: [],
      images: []
    }

    const payload: EventSendMessage = {
      roomId,
      message
    }

    await put(message)
    await mutate(roomId, (room) => {
      room.messages.push(message.id)
    })

    socket.emit<SocketActions>('send-message', payload)
    messageText.value = ''
  }

  return {
    messageText,
    isSendDisabled,
    sendMessage
  }
}
