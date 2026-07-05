import { computed, type Ref } from 'vue'

import { getClientPlatform, log, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'
import type { DevicePermissionStatus } from '../../config/types/devices.types'
import { getDevicePermissionCalloutType } from '../../lib/get-device-permission-callout-type'

export const useDevicePermissionStatus = (
  isSupported: Readonly<Ref<boolean>>,
  permission: Readonly<Ref<DevicePermissionStatus>>
) => {
  const { t } = useI18n()
  const isNativeClient = getClientPlatform() === 'native'

  const resolvePermissionStatusText = (status: DevicePermissionStatus) => {
    if (!isSupported.value) return t(SETTINGS_PAGE_DEVICES_I18N.permissionUnsupported)
    if (status === 'granted') return t(SETTINGS_PAGE_DEVICES_I18N.permissionGranted)
    if (status === 'denied') return t(SETTINGS_PAGE_DEVICES_I18N.permissionDenied)
    if (status === 'prompt') {
      return t(
        isNativeClient ? SETTINGS_PAGE_DEVICES_I18N.permissionNativePrompt : SETTINGS_PAGE_DEVICES_I18N.permissionPrompt
      )
    }

    return t(SETTINGS_PAGE_DEVICES_I18N.permissionUnknown)
  }

  return {
    permissionCalloutType: computed(() =>
      isSupported.value ? getDevicePermissionCalloutType(permission.value) : 'warning'
    ),
    permissionStatus: computed(() =>
      t(SETTINGS_PAGE_DEVICES_I18N.permissionStatus, { status: resolvePermissionStatusText(permission.value) })
    )
  }
}

export const useDeviceWarning = (message: string) => {
  const { t } = useI18n()
  const toast = useAppToast()
  const isNativeClient = getClientPlatform() === 'native'

  return {
    showDeviceWarning: (error: unknown) => {
      log('warn', message, error)
      toast.add({
        type: 'warning',
        title: t(TOAST_I18N.warn),
        content: t(
          isNativeClient
            ? SETTINGS_PAGE_DEVICES_I18N.cantAccessNativeDevice
            : SETTINGS_PAGE_DEVICES_I18N.cantAccessDevice
        )
      })
    }
  }
}
