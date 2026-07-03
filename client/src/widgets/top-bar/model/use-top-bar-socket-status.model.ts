import { useTimeoutFn } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

import { socketStatus, useSocketAvailability, useSocketReconnect } from 'src/shared/api'
import type { SocketAvailabilityStatus } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

import { TOP_BAR_OFFLINE_STATUS_DELAY_MS, TOP_BAR_SOCKET_RECONNECT_LOADING_MIN_MS } from '../config/constants'
import { TOP_BAR_I18N } from '../config/i18n'

export const useTopBarSocketStatus = () => {
  const { t } = useI18n()
  const { socketAvailabilityStatus } = useSocketAvailability()
  const { socketReconnect } = useSocketReconnect()
  const displayedSocketStatus = ref<SocketAvailabilityStatus | null>(null)
  const isSocketReconnectLoading = ref(false)
  const isSocketReconnectAttemptFinished = ref(false)
  const isSocketReconnectMinimumLoadingTimeElapsed = ref(false)

  const { start: startOfflineStatusTimer, stop: stopOfflineStatusTimer } = useTimeoutFn(
    () => {
      displayedSocketStatus.value = 'offline'
    },
    TOP_BAR_OFFLINE_STATUS_DELAY_MS,
    { immediate: false }
  )

  const stopSocketReconnectLoading = () => {
    if (!isSocketReconnectAttemptFinished.value || !isSocketReconnectMinimumLoadingTimeElapsed.value) return

    isSocketReconnectLoading.value = false
  }

  const { start: startSocketReconnectLoadingTimer, stop: stopSocketReconnectLoadingTimer } = useTimeoutFn(
    () => {
      isSocketReconnectMinimumLoadingTimeElapsed.value = true
      stopSocketReconnectLoading()
    },
    TOP_BAR_SOCKET_RECONNECT_LOADING_MIN_MS,
    { immediate: false }
  )

  const startSocketReconnectLoading = () => {
    stopSocketReconnectLoadingTimer()

    isSocketReconnectAttemptFinished.value = false
    isSocketReconnectMinimumLoadingTimeElapsed.value = false
    isSocketReconnectLoading.value = true

    startSocketReconnectLoadingTimer()
  }

  const socketTag = computed(() => {
    switch (displayedSocketStatus.value) {
      case 'online':
        return { color: 'var(--nmorph-success-text-color)' as const, isBlinking: false, value: t(TOP_BAR_I18N.online) }
      case 'reconnecting':
        return {
          color: 'var(--nmorph-warn-text-color)' as const,
          isBlinking: true,
          value: t(TOP_BAR_I18N.reconnecting)
        }
      case 'offline':
        return { color: 'var(--nmorph-error-text-color)' as const, isBlinking: false, value: t(TOP_BAR_I18N.offline) }
      default:
        return null
    }
  })
  const showSocketReconnectAction = computed(
    () => displayedSocketStatus.value === 'offline' && socketStatus.isReconnectFailed.value
  )

  const reconnectSocket = async () => {
    if (isSocketReconnectLoading.value) return

    startSocketReconnectLoading()

    try {
      await socketReconnect()
    } finally {
      isSocketReconnectAttemptFinished.value = true
      stopSocketReconnectLoading()
    }
  }

  watch(
    socketAvailabilityStatus,
    (status) => {
      stopOfflineStatusTimer()

      if (status !== 'offline') {
        displayedSocketStatus.value = status
        stopSocketReconnectLoadingTimer()
        isSocketReconnectLoading.value = false
        return
      }

      startOfflineStatusTimer()
    },
    { immediate: true }
  )

  return {
    isSocketReconnectLoading,
    reconnectSocket,
    showSocketReconnectAction,
    socketTag
  }
}
