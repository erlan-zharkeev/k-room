import { isString, isUnknownObject, ROOM_CALL_SIGNAL_KIND } from 'global-shared'

import type { RoomCallDescriptionSignalKind } from '../config/types'

export const isRoomCallSessionDescriptionSignal = (
  signal: unknown,
  signalKind: RoomCallDescriptionSignalKind
): signal is RTCSessionDescriptionInit => {
  if (!isUnknownObject(signal)) {
    return false
  }

  const signalType = signal.type

  return isString(signalType) && signalType === signalKind
}

export const isRoomCallIceCandidateSignal = (signal: unknown): signal is RTCIceCandidateInit => {
  if (!isUnknownObject(signal)) {
    return false
  }

  const candidate = signal.candidate
  const hasCandidate = candidate === undefined || candidate === null || isString(candidate)

  return hasCandidate
}

export const isRoomCallDescriptionSignalKind = (
  signalKind: string
): signalKind is RoomCallDescriptionSignalKind => {
  const isOfferSignal = signalKind === ROOM_CALL_SIGNAL_KIND.OFFER
  const isAnswerSignal = signalKind === ROOM_CALL_SIGNAL_KIND.ANSWER

  return isOfferSignal || isAnswerSignal
}
