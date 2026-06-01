import type { NmorphCalloutType } from '@nmorph/nmorph-ui-kit'

import type { DevicePermissionStatus } from '../config/types/devices.types'

export const getDevicePermissionCalloutType = (status: DevicePermissionStatus): NmorphCalloutType => {
  if (status === 'granted') return 'success'
  if (status === 'denied') return 'error'
  return 'warning'
}
