import { describe, expect, it } from 'vitest'

import {
  hasSwitchableRoomCallVideoInputDevice,
  isRoomCallVideoFacingModeMirrored,
  resolveNextRoomCallVideoFacingMode,
  resolveRoomCallVideoDeviceLabelFacingMode,
  resolveRoomCallVideoStreamFacingMode
} from './room-call-media'

const createVideoStream = (settings: MediaTrackSettings) =>
  ({
    getVideoTracks: () => [
      {
        getSettings: () => settings
      } as MediaStreamTrack
    ]
  } as MediaStream)

const createVideoDevice = (deviceId: string, label: string) =>
  ({
    deviceId,
    label,
    kind: 'videoinput'
  } as MediaDeviceInfo)

describe('room call media helpers', () => {
  it('mirrors only front-facing local video', () => {
    expect(isRoomCallVideoFacingModeMirrored('user')).toBe(true)
    expect(isRoomCallVideoFacingModeMirrored('environment')).toBe(false)
    expect(isRoomCallVideoFacingModeMirrored(null)).toBe(false)
  })

  it('resolves video facing mode from track settings first', () => {
    const stream = createVideoStream({
      deviceId: 'camera-1',
      facingMode: 'user'
    })

    expect(resolveRoomCallVideoStreamFacingMode(stream, [createVideoDevice('camera-1', 'Back Camera')])).toBe('user')
  })

  it('falls back to device labels when track settings do not expose facing mode', () => {
    const stream = createVideoStream({ deviceId: 'camera-1' })

    expect(resolveRoomCallVideoStreamFacingMode(stream, [createVideoDevice('camera-1', 'Rear Camera')])).toBe(
      'environment'
    )
    expect(resolveRoomCallVideoDeviceLabelFacingMode('FaceTime HD Camera')).toBe('user')
  })

  it('switches between front and back camera requests', () => {
    expect(resolveNextRoomCallVideoFacingMode('user')).toBe('environment')
    expect(resolveNextRoomCallVideoFacingMode('environment')).toBe('user')
    expect(resolveNextRoomCallVideoFacingMode(null)).toBe('user')
  })

  it('shows video input switch only when another real camera is available', () => {
    expect(hasSwitchableRoomCallVideoInputDevice([createVideoDevice('camera-1', 'FaceTime HD Camera')])).toBe(false)
    expect(
      hasSwitchableRoomCallVideoInputDevice([
        createVideoDevice('camera-1', 'Front Camera'),
        createVideoDevice('camera-2', 'Back Camera')
      ])
    ).toBe(true)
    expect(
      hasSwitchableRoomCallVideoInputDevice([
        createVideoDevice('', ''),
        createVideoDevice('', ''),
        {
          deviceId: 'microphone-1',
          kind: 'audioinput',
          label: 'Microphone'
        } as MediaDeviceInfo
      ])
    ).toBe(false)
  })
})
