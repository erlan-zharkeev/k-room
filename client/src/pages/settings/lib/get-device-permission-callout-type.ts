import type { DevicePermissionCalloutType, DevicePermissionStatusType } from '../config/types/devices.types'

export const getDevicePermissionCalloutType = (status: DevicePermissionStatusType): DevicePermissionCalloutType => {
  if (status === 'granted') return 'success'
  if (status === 'denied') return 'error'
  return 'warning'
}
