import { isBoolean, isNumber, isString, isUnknownObject } from 'global-shared'

import { serverCaptureSentryScopedMessage } from 'src/shared/lib/sentry'

const readPrimitiveField = (value: unknown, field: string) => {
  if (!isUnknownObject(value)) return undefined

  const fieldValue = Reflect.get(value, field)

  return isString(fieldValue) || isNumber(fieldValue) || isBoolean(fieldValue) ? fieldValue : undefined
}

const buildRoomCallDescriptionDiagnostics = (signal: Record<string, unknown>) => {
  const sdp = readPrimitiveField(signal, 'sdp')
  const sdpText = isString(sdp) ? sdp : ''

  return {
    audioMLineCount: sdpText.match(/^m=audio/gm)?.length ?? 0,
    candidateLineCount: sdpText.match(/^a=candidate:/gm)?.length ?? 0,
    hasAudioMLine: sdpText.includes('m=audio'),
    hasRecvOnly: sdpText.includes('a=recvonly'),
    hasSendOnly: sdpText.includes('a=sendonly'),
    hasSendRecv: sdpText.includes('a=sendrecv'),
    hasVideoMLine: sdpText.includes('m=video'),
    lineCount: sdpText ? sdpText.split('\n').length : 0,
    sdpLength: sdpText.length,
    type: readPrimitiveField(signal, 'type'),
    videoMLineCount: sdpText.match(/^m=video/gm)?.length ?? 0
  }
}

const resolveIceCandidateToken = (candidate: string, token: string) => {
  const parts = candidate.split(/\s+/)
  const tokenIndex = parts.indexOf(token)

  return tokenIndex === -1 ? undefined : parts[tokenIndex + 1]
}

const buildRoomCallIceCandidateDiagnostics = (signal: Record<string, unknown>) => {
  const candidate = readPrimitiveField(signal, 'candidate')
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

export const buildRoomCallServerSignalDiagnostics = (signal: unknown) => {
  if (!isUnknownObject(signal)) {
    return {
      present: signal !== null && signal !== undefined,
      type: typeof signal
    }
  }

  const type = Reflect.get(signal, 'type')

  if (type === 'offer' || type === 'answer') {
    return {
      present: true,
      ...buildRoomCallDescriptionDiagnostics(signal)
    }
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

export const captureRoomCallServerDiagnostic = (
  event: string,
  context: Record<string, unknown> = {},
  level: 'error' | 'info' | 'warning' = 'info'
) => {
  serverCaptureSentryScopedMessage(`Room call server diagnostic: ${event}`, (scope) => {
    scope.setLevel(level)
    scope.setTag('room_call.diagnostic', 'true')
    scope.setTag('room_call.diagnostic_event', event)
    scope.setFingerprint(['room-call-server-diagnostic', event])
    scope.setContext('room_call_server_diagnostic', {
      event,
      createdAt: Date.now(),
      ...context
    })
  })
}
