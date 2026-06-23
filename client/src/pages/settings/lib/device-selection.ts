import type { NmorphSelectModelValueType } from '@nmorph/nmorph-ui-kit'

export const resolveSingleSelectValue = (value: NmorphSelectModelValueType, emptyValue = '') => {
  const deviceId = Array.isArray(value) ? value[0] : value

  if (!deviceId || deviceId === emptyValue) return ''

  return deviceId
}

export const resolveSelectedDeviceId = (devices: MediaDeviceInfo[], deviceId: string, emptyDeviceId = '') => {
  if (devices.length === 0) return emptyDeviceId

  return devices.some((device) => device.deviceId === deviceId) ? deviceId : devices[0]?.deviceId ?? ''
}

export const resolveConnectedDeviceId = (devices: MediaDeviceInfo[], previousDevices: MediaDeviceInfo[]) => {
  const previousDeviceIds = new Set(previousDevices.map(({ deviceId }) => deviceId))

  for (let index = devices.length - 1; index >= 0; index -= 1) {
    const { deviceId } = devices[index]

    if (deviceId && !previousDeviceIds.has(deviceId)) return deviceId
  }

  return ''
}

export const resolveSelectedDeviceIdOnDeviceChange = (
  devices: MediaDeviceInfo[],
  previousDevices: MediaDeviceInfo[],
  deviceId: string,
  emptyDeviceId = ''
) => {
  return resolveConnectedDeviceId(devices, previousDevices) || resolveSelectedDeviceId(devices, deviceId, emptyDeviceId)
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

export const syncSelectedDeviceIdOnDeviceChange = async (
  devices: MediaDeviceInfo[],
  previousDevices: MediaDeviceInfo[],
  deviceId: string,
  emptyDeviceId: string,
  updateDeviceId: (deviceId: string) => Promise<void>
) => {
  const nextDeviceId = resolveSelectedDeviceIdOnDeviceChange(devices, previousDevices, deviceId, emptyDeviceId)

  if (nextDeviceId !== deviceId) {
    await updateDeviceId(nextDeviceId)
  }

  return nextDeviceId
}
