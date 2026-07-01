import sumBy from 'lodash/sumBy'
import { computed, onBeforeUnmount, onMounted, watch, type WatchStopHandle } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'

import { syncAppBadge } from '../lib/app-badge'

export const useAppBadge = () => {
  const { chatRooms } = useChatRoom()
  let stopUnreadMessagesQuantityWatch: WatchStopHandle | null = null

  const unreadMessagesQuantity = computed(() => sumBy(chatRooms.value, 'unreadMessagesQuantity'))

  onMounted(() => {
    stopUnreadMessagesQuantityWatch = watch(
      unreadMessagesQuantity,
      (value) => {
        void syncAppBadge(value)
      },
      { immediate: true }
    )
  })

  onBeforeUnmount(() => {
    stopUnreadMessagesQuantityWatch?.()
    stopUnreadMessagesQuantityWatch = null
  })
}
