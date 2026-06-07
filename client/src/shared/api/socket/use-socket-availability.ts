import { computed } from 'vue'

import { SOCKET_AVAILABILITY_STATUS } from './constants'
import { socketStatus } from './socket-status'
import type { SocketAvailabilityStatus } from './types'

export const useSocketAvailability = () => {
  const socketAvailabilityStatus = computed<SocketAvailabilityStatus>(() => {
    if (socketStatus.isConnected.value) return SOCKET_AVAILABILITY_STATUS.ONLINE
    if (socketStatus.isReconnecting.value) return SOCKET_AVAILABILITY_STATUS.RECONNECTING

    return SOCKET_AVAILABILITY_STATUS.OFFLINE
  })
  const isSocketOnlineActionAvailable = computed(
    () => socketAvailabilityStatus.value === SOCKET_AVAILABILITY_STATUS.ONLINE
  )

  return {
    socketAvailabilityStatus,
    isSocketOnlineActionAvailable
  }
}
