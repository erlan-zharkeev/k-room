import { isString, isUnknownObject } from 'global-shared'

import type { RoomCallDescriptionSignalKind } from '../config/types'

export const isRoomCallSessionDescriptionSignal = (
  signal: unknown,
  signalKind: RoomCallDescriptionSignalKind
): signal is RTCSessionDescriptionInit => {
  if (!isUnknownObject(signal)) {
    return false
  }

  const { type: signalType, sdp: signalSdp } = signal

  return isString(signalType) && signalType === signalKind && isString(signalSdp)
}

export const isRoomCallIceCandidateSignal = (signal: unknown): signal is RTCIceCandidateInit => {
  if (!isUnknownObject(signal)) {
    return false
  }

  const candidate = signal.candidate
  const hasCandidate = candidate === undefined || candidate === null || isString(candidate)

  return hasCandidate
}
