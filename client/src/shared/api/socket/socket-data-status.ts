import { readonly, ref } from 'vue'

import { SOCKET_DATA_SNAPSHOT_EVENTS } from './constants'
import type { SocketDataSnapshotEvent } from './types'

const isSocketDataLoading = ref(false)
const pendingSocketDataSnapshotEvents = new Set<SocketDataSnapshotEvent>()

export const socketDataStatus = {
  isLoading: readonly(isSocketDataLoading)
}

export const startSocketDataLoading = () => {
  pendingSocketDataSnapshotEvents.clear()
  SOCKET_DATA_SNAPSHOT_EVENTS.forEach((event) => pendingSocketDataSnapshotEvents.add(event))
  isSocketDataLoading.value = true
}

export const markSocketDataSnapshotLoaded = (event: SocketDataSnapshotEvent) => {
  if (!isSocketDataLoading.value) return

  pendingSocketDataSnapshotEvents.delete(event)

  if (pendingSocketDataSnapshotEvents.size === 0) {
    isSocketDataLoading.value = false
  }
}

export const stopSocketDataLoading = () => {
  pendingSocketDataSnapshotEvents.clear()
  isSocketDataLoading.value = false
}
