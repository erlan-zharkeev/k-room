import sumBy from 'lodash/sumBy'
import { computed, onBeforeUnmount, onMounted, watch, type WatchStopHandle } from 'vue'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMissedRoomCall } from 'src/entities/room-call'
import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { syncAppBadge } from 'src/shared/lib'

export const useAppBadge = () => {
  const { chatRooms } = useChatRoom()
  const { invitationsQuantity } = useContact()
  const { settings } = useSettings()
  const { user } = useUser()
  const { unseenMissedRoomCallQuantity } = useMissedRoomCall(
    () => user.value.id,
    () => settings.value.roomCalls.lastSeenMissedRoomCallCalledAt
  )
  let stopAppBadgeQuantityWatch: WatchStopHandle | null = null

  const unreadMessagesQuantity = computed(() => sumBy(chatRooms.value, 'unreadMessagesQuantity'))
  const appBadgeQuantity = computed(
    () => unreadMessagesQuantity.value + unseenMissedRoomCallQuantity.value + invitationsQuantity.value
  )

  onMounted(() => {
    stopAppBadgeQuantityWatch = watch(
      appBadgeQuantity,
      (value) => {
        void syncAppBadge(value)
      },
      { immediate: true }
    )
  })

  onBeforeUnmount(() => {
    stopAppBadgeQuantityWatch?.()
    stopAppBadgeQuantityWatch = null
  })
}
