import { computed, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { CHAT_ROOM_CONTENT_VIEW_QUERY_KEY } from '../config/constants'
import type { ChatRoomContentView } from '../config/types'

export const useChatRoomContentView = (hasSelectedRoomCall: ComputedRef<boolean>) => {
  const route = useRoute()
  const router = useRouter()

  const changeChatRoomContentView = (view: ChatRoomContentView) => {
    const query = { ...route.query }
    const shouldSaveTextView = view === 'text' && hasSelectedRoomCall.value

    if (shouldSaveTextView) {
      query[CHAT_ROOM_CONTENT_VIEW_QUERY_KEY] = 'text'
    } else {
      delete query[CHAT_ROOM_CONTENT_VIEW_QUERY_KEY]
    }

    router.replace({ query })
  }
  const chatRoomContentView = computed<ChatRoomContentView>(() => {
    const isTextViewRequested = route.query[CHAT_ROOM_CONTENT_VIEW_QUERY_KEY] === 'text'

    return hasSelectedRoomCall.value && !isTextViewRequested ? 'call' : 'text'
  })

  const isChatRoomTextView = computed(() => chatRoomContentView.value === 'text')

  return {
    chatRoomContentView,
    isChatRoomTextView,
    changeChatRoomContentView
  }
}
