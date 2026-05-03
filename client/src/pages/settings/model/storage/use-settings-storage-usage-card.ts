import { onMounted, ref } from 'vue'

export const useSettingsStorageUsageCard = () => {
  const usageBytes = ref(0)
  const quotaBytes = ref(0)
  const usagePercent = ref(0)

  const loadEstimate = async () => {
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

  onMounted(() => {
    void loadEstimate()
  })

  return {
    usageBytes,
    quotaBytes,
    usagePercent
  }
}
