export const buildRoomCallMediaDeviceConstraints = (deviceId: string): MediaTrackConstraints | true =>
  deviceId ? { deviceId: { exact: deviceId } } : true

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

export const hasEnabledRoomCallMediaTrack = (
  stream: MediaStream | null | undefined,
  kind: MediaStreamTrack['kind']
) =>
  Boolean(
    stream?.getTracks().some((track) => {
      const isTargetKind = track.kind === kind
      const isLiveTrack = track.readyState === 'live'

      return isTargetKind && isLiveTrack && track.enabled
    })
  )
