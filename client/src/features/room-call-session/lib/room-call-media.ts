import { ROOM_CALL_VIDEO_FACING_MODE_VALUES } from '../config/media.constants'
import type { RoomCallVideoFacingMode } from '../config/types'

export const buildRoomCallMediaDeviceConstraints = (deviceId: string): MediaTrackConstraints | true =>
  deviceId ? { deviceId: { exact: deviceId } } : true

export const buildRoomCallAudioDeviceConstraints = (deviceId: string): MediaTrackConstraints => ({
  ...(deviceId && { deviceId: { exact: deviceId } }),
  autoGainControl: true,
  echoCancellation: true,
  noiseSuppression: true
})

export const buildRoomCallVideoDeviceConstraints = (
  deviceId: string,
  facingMode?: RoomCallVideoFacingMode
): MediaTrackConstraints | true => {
  if (facingMode) {
    return { facingMode: { ideal: facingMode } }
  }

  return buildRoomCallMediaDeviceConstraints(deviceId)
}

export const stopRoomCallMediaStream = (stream?: MediaStream | null) => {
  stream?.getTracks().forEach((track) => {
    track.stop()
  })
}

export const setRoomCallMediaStreamTracksEnabled = (
  stream: MediaStream | null | undefined,
  kind: MediaStreamTrack['kind'],
  enabled: boolean
) => {
  stream?.getTracks().forEach((track) => {
    if (track.kind === kind) {
      track.enabled = enabled
    }
  })
}

export const hasEnabledRoomCallMediaTrack = (stream: MediaStream | null | undefined, kind: MediaStreamTrack['kind']) =>
  Boolean(
    stream?.getTracks().some((track) => {
      const isTargetKind = track.kind === kind
      const isLiveTrack = track.readyState === 'live'

      return isTargetKind && isLiveTrack && track.enabled
    })
  )

export const isRoomCallVideoFacingMode = (value?: string): value is RoomCallVideoFacingMode =>
  ROOM_CALL_VIDEO_FACING_MODE_VALUES.some((facingMode) => facingMode === value)

export const resolveRoomCallVideoDeviceLabelFacingMode = (label: string): RoomCallVideoFacingMode | null => {
  const normalizedLabel = label.toLowerCase()
  const isFrontFacing = /front|user|face|selfie/.test(normalizedLabel)

  if (isFrontFacing) {
    return 'user'
  }

  const isBackFacing = /back|rear|environment|world/.test(normalizedLabel)

  return isBackFacing ? 'environment' : null
}

export const resolveRoomCallVideoStreamFacingMode = (
  stream: MediaStream | null | undefined,
  devices: MediaDeviceInfo[] = []
): RoomCallVideoFacingMode | null => {
  const [track] = stream?.getVideoTracks() ?? []

  if (!track) {
    return null
  }

  const settings = track.getSettings()

  if (isRoomCallVideoFacingMode(settings.facingMode)) {
    return settings.facingMode
  }

  const device = devices.find(({ deviceId }) => deviceId === settings.deviceId)

  return device ? resolveRoomCallVideoDeviceLabelFacingMode(device.label) : null
}

export const resolveRoomCallVideoInputDeviceId = (stream: MediaStream | null | undefined) => {
  const [track] = stream?.getVideoTracks() ?? []

  return track?.getSettings().deviceId ?? ''
}

export const hasSwitchableRoomCallVideoInputDevice = (devices: MediaDeviceInfo[]) => {
  const videoInputDeviceKeys = new Set(
    devices
      .filter(({ kind }) => kind === 'videoinput')
      .map(({ deviceId, groupId, label }) => deviceId || groupId || label)
      .filter(Boolean)
  )

  return videoInputDeviceKeys.size > 1
}

export const isRoomCallVideoFacingModeMirrored = (facingMode?: RoomCallVideoFacingMode | null) => facingMode === 'user'

export const resolveNextRoomCallVideoFacingMode = (
  facingMode?: RoomCallVideoFacingMode | null
): RoomCallVideoFacingMode => (facingMode === 'user' ? 'environment' : 'user')
