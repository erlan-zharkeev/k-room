import { computed } from 'vue'

import { useMediaDevicePermission, useStorageEstimate } from 'src/shared/lib'

import type { SettingsContentId, SettingsContentWarningById } from '../config/types/content.types'

export const useSettingsContentWarnings = () => {
  const { isStorageUsageWarning } = useStorageEstimate()
  const { hasMediaDevicePermissionWarning } = useMediaDevicePermission()
  const hasWarningByContentId = computed<SettingsContentWarningById>(() => ({
    account: false,
    devices: hasMediaDevicePermissionWarning.value,
    storage: isStorageUsageWarning.value
  }))

  const hasContentWarning = (settingsId: SettingsContentId) => {
    switch (settingsId) {
      case 'account':
      case 'devices':
      case 'storage':
        return hasWarningByContentId.value[settingsId]
      default:
        return false
    }
  }

  return {
    hasWarningByContentId,
    hasContentWarning
  }
}
