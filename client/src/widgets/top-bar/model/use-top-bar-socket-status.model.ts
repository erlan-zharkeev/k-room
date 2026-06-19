import { useTimeoutFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

import { useSocketAvailability } from 'src/shared/api'
import type { SocketAvailabilityStatus } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { TOP_BAR_OFFLINE_STATUS_DELAY_MS } from '../config/constants'
import { TOP_BAR_I18N } from '../config/i18n'

export const useTopBarSocketStatus = () => {
  const { t } = useI18n()
  const { socketAvailabilityStatus } = useSocketAvailability()
  const displayedSocketStatus = ref<SocketAvailabilityStatus | null>(null)

  const { start: startOfflineStatusTimer, stop: stopOfflineStatusTimer } = useTimeoutFn(
    () => {
      displayedSocketStatus.value = 'offline'
    },
    TOP_BAR_OFFLINE_STATUS_DELAY_MS,
    { immediate: false }
  )

  const socketTag = computed(() => {
    switch (displayedSocketStatus.value) {
      case 'online':
        return { color: 'var(--nmorph-success-color)' as const, isBlinking: false, value: t(TOP_BAR_I18N.online) }
      case 'reconnecting':
        return { color: 'var(--nmorph-warn-color)' as const, isBlinking: true, value: t(TOP_BAR_I18N.reconnecting) }
      case 'offline':
        return { color: 'var(--nmorph-error-color)' as const, isBlinking: false, value: t(TOP_BAR_I18N.offline) }
      default:
        return null
    }
  })

  watch(
    socketAvailabilityStatus,
    (status) => {
      stopOfflineStatusTimer()

      if (status !== 'offline') {
        displayedSocketStatus.value = status
        return
      }

      startOfflineStatusTimer()
    },
    { immediate: true }
  )

  return {
    socketTag
  }
}
