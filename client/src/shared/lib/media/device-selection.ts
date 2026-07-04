import { DEFAULT_MEDIA_DEVICE_SELECT_VALUE } from './constants'
import type { BuildMediaDeviceSelectOptionsParams, MediaDeviceSelectModelValue, MediaDeviceSelectOption } from './types'

export const resolveMediaDeviceSelectValue = (
  value: MediaDeviceSelectModelValue = '',
  emptyValue = DEFAULT_MEDIA_DEVICE_SELECT_VALUE
) => {
  const deviceId = Array.isArray(value) ? value[0] : value

  if (!deviceId || deviceId === emptyValue) return ''

  return deviceId
}

export const resolveMediaDeviceSelectOptionValue = (deviceId: string, emptyValue = DEFAULT_MEDIA_DEVICE_SELECT_VALUE) =>
  deviceId || emptyValue

export const buildMediaDeviceSelectOptions = ({
  defaultOptionLabel,
  devices,
  emptyValue = DEFAULT_MEDIA_DEVICE_SELECT_VALUE,
  unknownOptionLabel,
  unknownOptionLabelWithIndex = false
}: BuildMediaDeviceSelectOptionsParams) => {
  const optionsByValue = new Map<string, MediaDeviceSelectOption>()

  if (defaultOptionLabel) {
    optionsByValue.set(emptyValue, {
      value: emptyValue,
      label: defaultOptionLabel
    })
  }

  devices.forEach(({ deviceId, label }, index) => {
    const value = resolveMediaDeviceSelectOptionValue(deviceId, emptyValue)

    if (optionsByValue.has(value)) {
      return
    }

    optionsByValue.set(value, {
      value,
      label: label || `${unknownOptionLabel}${unknownOptionLabelWithIndex ? ` ${index + 1}` : ''}`
    })
  })

  return [...optionsByValue.values()]
}

export const resolveSelectedDeviceId = (devices: MediaDeviceInfo[], deviceId: string, emptyDeviceId = '') => {
  if (devices.length === 0) return emptyDeviceId

  return devices.some((device) => device.deviceId === deviceId) ? deviceId : devices[0]?.deviceId ?? ''
}

export const resolveConnectedDeviceId = (devices: MediaDeviceInfo[], previousDevices: MediaDeviceInfo[]) => {
  if (previousDevices.length === 0) return ''

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
