import { computed } from 'vue'

import { socketStatus } from './socket-status'
import type { SocketAvailabilityStatus } from './types'

export const useSocketAvailability = () => {
  const socketAvailabilityStatus = computed<SocketAvailabilityStatus>(() => {
    if (socketStatus.isConnected.value) return 'online'
    if (socketStatus.isReconnecting.value) return 'reconnecting'

    return 'offline'
  })
  const isSocketOnlineActionAvailable = computed(() => socketAvailabilityStatus.value === 'online')

  return {
    socketAvailabilityStatus,
    isSocketOnlineActionAvailable
  }
}
