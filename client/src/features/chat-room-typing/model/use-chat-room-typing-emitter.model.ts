import { useTimeoutFn } from '@vueuse/core'
import type { ChatRoom, EventUserTyping } from 'global-shared'
import { onBeforeUnmount, type Ref, watch } from 'vue'

import { socket, useSocketAvailability } from 'src/shared/api'

import { CHAT_ROOM_TYPING_IDLE_TIMEOUT_MS } from '../config/constants'

const emitTypingStatus = (
  roomId: string,
  isTyping: boolean,
  isSocketOnlineActionAvailable: Ref<boolean>
) => {
  if (!isSocketOnlineActionAvailable.value) return

  const payload: EventUserTyping = {
    roomId,
    isTyping
  }

  socket.emit('client-typing', payload)
}

export const useChatRoomTypingEmitter = (room: Ref<ChatRoom>, messageText: Ref<string>) => {
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
  let typingRoomId: string | null = null

  const stopTyping = () => {
    if (!typingRoomId) return

    const roomId = typingRoomId

    typingRoomId = null
    stopTypingTimer()
    emitTypingStatus(roomId, false, isSocketOnlineActionAvailable)
  }

  const { start: startTypingTimer, stop: stopTypingTimer } = useTimeoutFn(
    stopTyping,
    CHAT_ROOM_TYPING_IDLE_TIMEOUT_MS,
    { immediate: false }
  )

  const startTyping = () => {
    const roomId = room.value.id

    if (typingRoomId && typingRoomId !== roomId) {
      stopTyping()
    }

    if (!typingRoomId) {
      typingRoomId = roomId
      emitTypingStatus(roomId, true, isSocketOnlineActionAvailable)
    }

    startTypingTimer()
  }

  watch(messageText, (value) => {
    const hasMessageText = Boolean(value.trim())

    if (!hasMessageText) {
      stopTyping()
      return
    }

    startTyping()
  })
  watch(() => room.value.id, stopTyping)
  onBeforeUnmount(stopTyping)

  return {
    stopTyping
  }
}
