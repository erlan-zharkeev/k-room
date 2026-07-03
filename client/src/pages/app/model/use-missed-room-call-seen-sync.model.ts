import { onBeforeUnmount, onMounted, watch, type WatchStopHandle } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useSocketAction, useSocketAvailability } from 'src/shared/api'

export const useMissedRoomCallSeenSync = () => {
  const { settings, setByPath } = useSettings()
  const { emitSocketAction } = useSocketAction()
  const { isSocketOnlineActionAvailable } = useSocketAvailability()
  let stopSeenSyncWatch: WatchStopHandle | null = null

  const syncMissedRoomCallSeenState = async () => {
    const { lastSeenMissedRoomCallCalledAt, lastSyncedMissedRoomCallCalledAt } = settings.value.roomCalls

    if (!isSocketOnlineActionAvailable.value || lastSeenMissedRoomCallCalledAt <= lastSyncedMissedRoomCallCalledAt) {
      return
    }

    const response = await emitSocketAction('mark-room-calls-as-seen', {
      lastSeenMissedRoomCallCalledAt
    })

    if (!response.ok) return

    await setByPath('roomCalls.lastSyncedMissedRoomCallCalledAt', lastSeenMissedRoomCallCalledAt)
  }

  onMounted(() => {
    stopSeenSyncWatch = watch(
      () => [isSocketOnlineActionAvailable.value, settings.value.roomCalls.lastSeenMissedRoomCallCalledAt],
      () => {
        void syncMissedRoomCallSeenState()
      },
      { immediate: true }
    )
  })

  onBeforeUnmount(() => {
    stopSeenSyncWatch?.()
    stopSeenSyncWatch = null
  })
}
