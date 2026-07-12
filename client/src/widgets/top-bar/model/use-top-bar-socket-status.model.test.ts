import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import type { SocketAvailabilityStatus } from 'src/shared/api'

const TEST_SOCKET_UNAVAILABLE_STATUS_DELAY_MS = 10

const loadTopBarSocketStatus = async () => {
  const socketAvailabilityStatus = ref<SocketAvailabilityStatus>('online')
  const isReconnectFailed = ref(false)

  vi.doMock('src/shared/api', () => ({
    socketStatus: { isReconnectFailed },
    useSocketAvailability: () => ({ socketAvailabilityStatus }),
    useSocketReconnect: () => ({ socketReconnect: vi.fn() })
  }))
  vi.doMock('src/shared/lib', () => ({
    defineI18n: (_namespace: string, values: unknown) => values,
    useI18n: () => ({
      t: (value: { en: string }) => value.en
    })
  }))
  vi.doMock('../config/constants', () => ({
    TOP_BAR_SOCKET_RECONNECT_LOADING_MIN_MS: 1,
    TOP_BAR_SOCKET_UNAVAILABLE_STATUS_DELAY_MS: TEST_SOCKET_UNAVAILABLE_STATUS_DELAY_MS
  }))

  const { useTopBarSocketStatus } = await import('./use-top-bar-socket-status.model')

  return {
    socketAvailabilityStatus,
    ...useTopBarSocketStatus()
  }
}

describe('useTopBarSocketStatus', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not show a transient socket reconnection', async () => {
    const { socketAvailabilityStatus, socketTag } = await loadTopBarSocketStatus()

    socketAvailabilityStatus.value = 'reconnecting'
    await nextTick()
    await vi.advanceTimersByTimeAsync(TEST_SOCKET_UNAVAILABLE_STATUS_DELAY_MS - 1)

    expect(socketTag.value?.value).toBe('Online')

    socketAvailabilityStatus.value = 'online'
    await nextTick()
    await vi.advanceTimersByTimeAsync(TEST_SOCKET_UNAVAILABLE_STATUS_DELAY_MS)

    expect(socketTag.value?.value).toBe('Online')
  })

  it('shows a reconnection that lasts through the delay', async () => {
    const { socketAvailabilityStatus, socketTag } = await loadTopBarSocketStatus()

    socketAvailabilityStatus.value = 'reconnecting'
    await nextTick()
    await vi.advanceTimersByTimeAsync(TEST_SOCKET_UNAVAILABLE_STATUS_DELAY_MS)

    expect(socketTag.value?.value).toBe('Reconnecting')
  })
})
