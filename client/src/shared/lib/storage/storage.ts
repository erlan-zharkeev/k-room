import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import {
  STORAGE_ESTIMATE_REFRESH_INTERVAL_MS,
  STORAGE_WARNING_AVAILABLE_BYTES,
  STORAGE_WARNING_USAGE_PERCENT
} from './constants'

const usageBytes = ref(0)
const quotaBytes = ref(0)
const usagePercent = ref(0)
const availableBytes = computed(() => quotaBytes.value - usageBytes.value)
const isStorageUsageWarning = computed(() => {
  const hasQuota = quotaBytes.value > 0
  const hasHighUsage = usagePercent.value >= STORAGE_WARNING_USAGE_PERCENT
  const hasLowAvailableSpace = availableBytes.value <= STORAGE_WARNING_AVAILABLE_BYTES

  return hasQuota && (hasHighUsage || hasLowAvailableSpace)
})

let storageEstimateSubscribers = 0
let storageEstimateIntervalId: number | undefined

export const loadStorageEstimate = async () => {
  if (!navigator.storage?.estimate) return

  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate()

    usageBytes.value = usage
    quotaBytes.value = quota
    usagePercent.value = quota > 0 ? Math.min(Math.round((usage / quota) * 100), 100) : 0
  } catch {
    usageBytes.value = 0
    quotaBytes.value = 0
    usagePercent.value = 0
  }
}

const startStorageEstimateSubscription = () => {
  storageEstimateSubscribers += 1

  if (storageEstimateSubscribers > 1) return

  void loadStorageEstimate()
  storageEstimateIntervalId = window.setInterval(() => {
    void loadStorageEstimate()
  }, STORAGE_ESTIMATE_REFRESH_INTERVAL_MS)
}

const stopStorageEstimateSubscription = () => {
  storageEstimateSubscribers = Math.max(0, storageEstimateSubscribers - 1)

  if (storageEstimateSubscribers || storageEstimateIntervalId === undefined) return

  window.clearInterval(storageEstimateIntervalId)
  storageEstimateIntervalId = undefined
}

export const useStorageEstimate = () => {
  onMounted(startStorageEstimateSubscription)
  onBeforeUnmount(stopStorageEstimateSubscription)

  return {
    usageBytes,
    quotaBytes,
    usagePercent,
    availableBytes,
    isStorageUsageWarning,
    loadStorageEstimate
  }
}
