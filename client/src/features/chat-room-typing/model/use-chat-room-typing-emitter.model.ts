import { useTimeoutFn } from '@vueuse/core'
import type { EventUserTyping, SocketActions } from 'global-shared'
import { onBeforeUnmount, type Ref, watch } from 'vue'

import { socket } from 'src/shared/api'
import type { ChatRoomRecord } from 'src/shared/lib'

import { CHAT_ROOM_TYPING_IDLE_TIMEOUT_MS } from '../config/constants'

const emitTypingStatus = (roomId: string, isTyping: boolean) => {
  const payload: EventUserTyping = {
    roomId,
    isTyping
  }

  socket.emit<SocketActions>('client-typing', payload)
}

export const useChatRoomTypingEmitter = (room: Ref<ChatRoomRecord>, messageText: Ref<string>) => {
  let typingRoomId: string | null = null

  const stopTyping = () => {
    if (!typingRoomId) return

    const roomId = typingRoomId

    typingRoomId = null
    stopTypingTimer()
    emitTypingStatus(roomId, false)
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
      emitTypingStatus(roomId, true)
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
