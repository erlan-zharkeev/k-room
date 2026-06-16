import { computed } from 'vue'

import { formatBytes, useStorageEstimate } from 'src/shared/lib'

export const useStorageUsage = () => {
  const { usageBytes, quotaBytes, usagePercent, isStorageUsageWarning } = useStorageEstimate()
  const usageFormatted = computed(() => formatBytes(usageBytes.value))
  const availableFormatted = computed(() => formatBytes(quotaBytes.value - usageBytes.value))
  const quotaFormatted = computed(() => formatBytes(quotaBytes.value))

  return {
    availableFormatted,
    isStorageUsageWarning,
    quotaFormatted,
    usageFormatted,
    usagePercent
  }
}
