import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'
import { computed, type Ref } from 'vue'

import { log, TOAST_I18N, useAppToast, useI18n } from 'src/shared/lib'

import { SETTINGS_PAGE_DEVICES_I18N } from '../../config/i18n/devices.i18n'
import type { DevicePermissionStatus } from '../../config/types/devices.types'
import { getDevicePermissionCalloutType } from '../../lib/get-device-permission-callout-type'

export const normalizeDeviceSelectValue = (value: NmorphSelectModelValueType, emptyValue = '') => {
  const deviceId = Array.isArray(value) ? value[0] ?? '' : value

  return deviceId === emptyValue ? '' : deviceId
}

export const resolveSelectedDeviceId = (devices: MediaDeviceInfo[], deviceId: string, emptyDeviceId = '') => {
  if (devices.length === 0) return emptyDeviceId

  return devices.some((device) => device.deviceId === deviceId) ? deviceId : devices[0]?.deviceId ?? ''
}

export const syncSelectedDeviceId = async (
  devices: MediaDeviceInfo[],
  deviceId: string,
  emptyDeviceId: string,
  updateDeviceId: (deviceId: string) => Promise<void>
) => {
  const nextDeviceId = resolveSelectedDeviceId(devices, deviceId, emptyDeviceId)

  if (nextDeviceId !== deviceId) {
    await updateDeviceId(nextDeviceId)
  }

  return nextDeviceId
}

export const useDevicePermissionStatus = (
  isSupported: Readonly<Ref<boolean>>,
  permission: Readonly<Ref<DevicePermissionStatus>>
) => {
  const { t } = useI18n()

  const resolvePermissionStatusText = (status: DevicePermissionStatus) => {
    if (!isSupported.value) return t(SETTINGS_PAGE_DEVICES_I18N.permissionUnsupported)
    if (status === 'granted') return t(SETTINGS_PAGE_DEVICES_I18N.permissionGranted)
    if (status === 'denied') return t(SETTINGS_PAGE_DEVICES_I18N.permissionDenied)
    if (status === 'prompt') return t(SETTINGS_PAGE_DEVICES_I18N.permissionPrompt)

    return t(SETTINGS_PAGE_DEVICES_I18N.permissionUnknown)
  }

  return {
    permissionCalloutType: computed(() =>
      isSupported.value ? getDevicePermissionCalloutType(permission.value) : 'warning'
    ),
    permissionStatus: computed(() =>
      t(SETTINGS_PAGE_DEVICES_I18N.permissionStatus)(resolvePermissionStatusText(permission.value))
    )
  }
}

export const useDeviceWarning = (message: string) => {
  const { t } = useI18n()
  const toast = useAppToast()

  return {
    showDeviceWarning: (error: unknown) => {
      log('warn', message, error)
      toast.add({
        type: 'warning',
        title: t(TOAST_I18N.warn),
        content: t(SETTINGS_PAGE_DEVICES_I18N.cantAccessDevice)
      })
    }
  }
}
