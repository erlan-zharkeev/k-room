import { useTimeoutFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

import { socketStatus } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { TOP_BAR_OFFLINE_STATUS_DELAY_MS } from '../config/constants'
import { TOP_BAR_I18N } from '../config/i18n'

export const useTopBarSocketStatus = () => {
  const { t } = useI18n()
  const displayedSocketStatus = ref('')

  const socketStatusValue = computed(() => {
    if (socketStatus.isConnected.value) return 'online'
    if (socketStatus.isReconnecting.value) return 'reconnecting'
    return 'offline'
  })

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
        return { color: 'var(--nmorph-success-color)' as const, value: t(TOP_BAR_I18N.online) }
      case 'reconnecting':
        return { color: 'var(--nmorph-warn-color)' as const, value: t(TOP_BAR_I18N.reconnecting) }
      case 'offline':
        return { color: 'var(--nmorph-error-color)' as const, value: t(TOP_BAR_I18N.offline) }
      default:
        return null
    }
  })

  watch(
    socketStatusValue,
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
