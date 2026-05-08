import type { DevicePermissionCalloutType, DevicePermissionStatus } from '../config/types/devices.types'

export const getDevicePermissionCalloutType = (status: DevicePermissionStatus): DevicePermissionCalloutType => {
  if (status === 'granted') return 'success'
  if (status === 'denied') return 'error'
  return 'warning'
}
