import { describe, expect, it, vi } from 'vitest'

import {
  resolveSelectedDeviceIdOnDeviceChange,
  syncSelectedDeviceId,
  syncSelectedDeviceIdOnDeviceChange
} from './device-selection'

const createDevice = (deviceId: string) => ({ deviceId } as MediaDeviceInfo)

describe('device selection helpers', () => {
  it('keeps persisted device id on initial device list load', () => {
    expect(
      resolveSelectedDeviceIdOnDeviceChange([createDevice('device-a'), createDevice('device-b')], [], 'device-a')
    ).toBe('device-a')
  })

  it('falls back when persisted device id is missing on initial device list load', async () => {
    const updateDeviceId = vi.fn<(deviceId: string) => Promise<void>>().mockResolvedValue(undefined)

    await expect(
      syncSelectedDeviceId([createDevice('device-a'), createDevice('device-b')], 'missing-device', '', updateDeviceId)
    ).resolves.toBe('device-a')

    expect(updateDeviceId).toHaveBeenCalledWith('device-a')
  })

  it('selects a newly connected device after the initial device list load', async () => {
    const updateDeviceId = vi.fn<(deviceId: string) => Promise<void>>().mockResolvedValue(undefined)

    await expect(
      syncSelectedDeviceIdOnDeviceChange(
        [createDevice('device-a'), createDevice('device-b'), createDevice('device-c')],
        [createDevice('device-a'), createDevice('device-b')],
        'device-a',
        '',
        updateDeviceId
      )
    ).resolves.toBe('device-c')

    expect(updateDeviceId).toHaveBeenCalledWith('device-c')
  })

  it('falls back when selected device is disconnected after the initial device list load', async () => {
    const updateDeviceId = vi.fn<(deviceId: string) => Promise<void>>().mockResolvedValue(undefined)

    await expect(
      syncSelectedDeviceIdOnDeviceChange(
        [createDevice('device-b')],
        [createDevice('device-a'), createDevice('device-b')],
        'device-a',
        '',
        updateDeviceId
      )
    ).resolves.toBe('device-b')

    expect(updateDeviceId).toHaveBeenCalledWith('device-b')
  })
})
