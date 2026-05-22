import type { DevicePermissionCallout, DevicePermissionStatus } from '../config/types/devices.types'

export const getDevicePermissionCalloutType = (status: DevicePermissionStatus): DevicePermissionCallout => {
  if (status === 'granted') return 'success'
  if (status === 'denied') return 'error'
  return 'warning'
}
