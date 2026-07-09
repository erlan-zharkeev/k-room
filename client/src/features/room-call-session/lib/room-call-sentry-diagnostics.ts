import { isBoolean, isNumber, isString, isUnknownObject } from 'global-shared'

import { captureClientSentryMessage, withClientSentryScope } from 'src/shared/lib'

import type { RoomCallLocalMediaStreamList } from '../config/types'

const readPrimitiveField = (value: unknown, field: string) => {
  if (!isUnknownObject(value)) return undefined

  const fieldValue = Reflect.get(value, field)

  return isString(fieldValue) || isNumber(fieldValue) || isBoolean(fieldValue) ? fieldValue : undefined
}

const buildMediaTrackSettingsDiagnostics = (track: MediaStreamTrack) => {
  const settings = track.getSettings()
  const diagnostics: Record<string, string | number | boolean> = {}

  ;[
    'aspectRatio',
    'autoGainControl',
    'channelCount',
    'displaySurface',
    'echoCancellation',
    'facingMode',
    'frameRate',
    'height',
    'noiseSuppression',
    'sampleRate',
    'sampleSize',
    'width'
  ].forEach((field) => {
    const value = readPrimitiveField(settings, field)

    if (value !== undefined) {
      diagnostics[field] = value
    }
  })

  return {
    ...diagnostics,
    hasDeviceId: Boolean(settings.deviceId),
    hasGroupId: Boolean(settings.groupId)
  }
}

export const buildRoomCallMediaTrackDiagnostics = (track: MediaStreamTrack | null | undefined) => {
  if (!track) {
    return {
      present: false
    }
  }

  return {
    present: true,
    contentHint: track.contentHint || null,
    enabled: track.enabled,
    id: track.id,
    kind: track.kind,
    label: track.label || null,
    muted: track.muted,
    readyState: track.readyState,
    settings: buildMediaTrackSettingsDiagnostics(track)
  }
}

export const buildRoomCallMediaStreamDiagnostics = (stream: MediaStream | null | undefined) => {
  if (!stream) {
    return {
      present: false
    }
  }

  return {
    present: true,
    active: stream.active,
    audioTracks: stream.getAudioTracks().map(buildRoomCallMediaTrackDiagnostics),
    id: stream.id,
    trackCount: stream.getTracks().length,
    videoTracks: stream.getVideoTracks().map(buildRoomCallMediaTrackDiagnostics)
  }
}

export const buildRoomCallLocalStreamsDiagnostics = (streams: RoomCallLocalMediaStreamList) => {
  return streams.map(buildRoomCallMediaStreamDiagnostics)
}

export const buildRoomCallLocalTrackIdDiagnostics = (streams: RoomCallLocalMediaStreamList) => {
  const tracks = streams.flatMap((stream) => stream?.getTracks() ?? [])
  const audioTracks = tracks.filter(({ kind }) => kind === 'audio')
  const videoTracks = tracks.filter(({ kind }) => kind === 'video')

  return {
    localAudioTrackIds: audioTracks.map(({ id }) => id).join(','),
    localAudioTrackCount: audioTracks.length,
    localStreamIds: streams.map((stream) => stream?.id ?? '').join(','),
    localVideoTrackIds: videoTracks.map(({ id }) => id).join(','),
    localVideoTrackCount: videoTracks.length
  }
}

const buildRoomCallDescriptionDiagnostics = (
  description: RTCSessionDescription | RTCSessionDescriptionInit | Record<string, unknown> | null
) => {
  if (!description) {
    return {
      present: false
    }
  }

  const sdp = readPrimitiveField(description, 'sdp')
  const sdpText = isString(sdp) ? sdp : ''

  return {
    present: true,
    audioMLineCount: sdpText.match(/^m=audio/gm)?.length ?? 0,
    candidateLineCount: sdpText.match(/^a=candidate:/gm)?.length ?? 0,
    hasAudioMLine: sdpText.includes('m=audio'),
    hasRecvOnly: sdpText.includes('a=recvonly'),
    hasSendOnly: sdpText.includes('a=sendonly'),
    hasSendRecv: sdpText.includes('a=sendrecv'),
    hasVideoMLine: sdpText.includes('m=video'),
    lineCount: sdpText ? sdpText.split('\n').length : 0,
    sdpLength: sdpText.length,
    type: readPrimitiveField(description, 'type'),
    videoMLineCount: sdpText.match(/^m=video/gm)?.length ?? 0
  }
}

const resolveIceCandidateToken = (candidate: string, token: string) => {
  const tokenIndex = candidate.split(/\s+/).indexOf(token)

  return tokenIndex === -1 ? undefined : candidate.split(/\s+/)[tokenIndex + 1]
}

const buildRoomCallIceCandidateDiagnostics = (signal: Record<string, unknown>) => {
  const candidate = Reflect.get(signal, 'candidate')
  const candidateText = isString(candidate) ? candidate : ''

  return {
    candidateLength: candidateText.length,
    candidatePresent: candidate !== null && candidate !== undefined && candidateText.length > 0,
    candidateType: candidateText ? resolveIceCandidateToken(candidateText, 'typ') : undefined,
    protocol: candidateText ? candidateText.split(/\s+/)[2]?.toLowerCase() : undefined,
    sdpMid: readPrimitiveField(signal, 'sdpMid'),
    sdpMLineIndex: readPrimitiveField(signal, 'sdpMLineIndex'),
    usernameFragmentPresent: Boolean(readPrimitiveField(signal, 'usernameFragment'))
  }
}

export const buildRoomCallSignalDiagnostics = (signal: unknown) => {
  if (!isUnknownObject(signal)) {
    return {
      present: signal !== null && signal !== undefined,
      type: typeof signal
    }
  }

  const type = Reflect.get(signal, 'type')

  if (type === 'offer' || type === 'answer') {
    return buildRoomCallDescriptionDiagnostics(signal)
  }

  if ('candidate' in signal) {
    return {
      present: true,
      type: 'ice-candidate',
      ...buildRoomCallIceCandidateDiagnostics(signal)
    }
  }

  return {
    present: true,
    keys: Object.keys(signal)
  }
}

export const buildRoomCallPeerConnectionDiagnostics = (peerConnection: RTCPeerConnection) => {
  return {
    canTrickleIceCandidates: peerConnection.canTrickleIceCandidates,
    connectionState: peerConnection.connectionState,
    currentLocalDescription: buildRoomCallDescriptionDiagnostics(peerConnection.currentLocalDescription),
    currentRemoteDescription: buildRoomCallDescriptionDiagnostics(peerConnection.currentRemoteDescription),
    iceConnectionState: peerConnection.iceConnectionState,
    iceGatheringState: peerConnection.iceGatheringState,
    localDescription: buildRoomCallDescriptionDiagnostics(peerConnection.localDescription),
    pendingLocalDescription: buildRoomCallDescriptionDiagnostics(peerConnection.pendingLocalDescription),
    pendingRemoteDescription: buildRoomCallDescriptionDiagnostics(peerConnection.pendingRemoteDescription),
    receivers: peerConnection.getReceivers().map((receiver, index) => ({
      index,
      track: buildRoomCallMediaTrackDiagnostics(receiver.track),
      transportState: receiver.transport?.state ?? null
    })),
    remoteDescription: buildRoomCallDescriptionDiagnostics(peerConnection.remoteDescription),
    senders: peerConnection.getSenders().map((sender, index) => ({
      index,
      track: buildRoomCallMediaTrackDiagnostics(sender.track),
      transportState: sender.transport?.state ?? null
    })),
    signalingState: peerConnection.signalingState,
    transceivers: peerConnection.getTransceivers().map((transceiver, index) => ({
      currentDirection: transceiver.currentDirection,
      direction: transceiver.direction,
      index,
      mid: transceiver.mid,
      receiverTrack: buildRoomCallMediaTrackDiagnostics(transceiver.receiver.track),
      senderTrack: buildRoomCallMediaTrackDiagnostics(transceiver.sender.track),
      stopped: readPrimitiveField(transceiver, 'stopped')
    }))
  }
}

export const buildRoomCallErrorDiagnostics = (error: unknown) => {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name
    }
  }

  return {
    type: typeof error
  }
}

const buildRoomCallRuntimeDiagnostics = () => {
  if (typeof navigator === 'undefined') {
    return {}
  }

  return {
    online: navigator.onLine,
    platform: navigator.platform,
    userAgent: navigator.userAgent
  }
}

export const captureRoomCallDiagnostic = (
  event: string,
  context: Record<string, unknown> = {},
  level: 'error' | 'info' | 'warning' = 'info'
) => {
  withClientSentryScope((scope) => {
    scope.setLevel(level)
    scope.setTag('room_call.diagnostic', 'true')
    scope.setTag('room_call.diagnostic_event', event)
    scope.setFingerprint(['room-call-diagnostic', event])
    scope.setContext('room_call_diagnostic', {
      event,
      createdAt: Date.now(),
      ...buildRoomCallRuntimeDiagnostics(),
      ...context
    })

    captureClientSentryMessage(`Room call diagnostic: ${event}`)
  })
}
