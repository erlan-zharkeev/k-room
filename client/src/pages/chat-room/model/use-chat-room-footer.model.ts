import {
  MESSAGE_BODY_MAX_LENGTH,
  MESSAGE_STATUS_VALUE,
  type EventSendMessage,
  type Message,
  type SocketActions
} from 'global-shared'
import { v4 as uuidv4 } from 'uuid'
import { computed, type Ref, ref } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useMessage } from 'src/entities/message'
import { useUser } from 'src/entities/user'
import { useChatRoomTypingEmitter } from 'src/features/chat-room-typing'
import { socket } from 'src/shared/api'
import type { ChatRoomRecord } from 'src/shared/lib'

export const useChatRoomFooter = (room: Ref<ChatRoomRecord>) => {
  const { mutate } = useChatRoom()
  const { put } = useMessage()
  const { user } = useUser()
  const messageText = ref('')
  const { stopTyping } = useChatRoomTypingEmitter(room, messageText)
  const isSendDisabled = computed(
    () => !messageText.value.trim() || messageText.value.length > MESSAGE_BODY_MAX_LENGTH || !user.value.id
  )

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
      status: MESSAGE_STATUS_VALUE.SENDING,
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
    stopTyping()
    messageText.value = ''
  }

  return {
    messageText,
    isSendDisabled,
    sendMessage
  }
}
