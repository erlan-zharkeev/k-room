import type { MediaId } from '../media/types'
import type { StreamSettings } from '../shared/types'

import type { CALL_FLOW, CALL_LEAVE_REASON, CALL_MEDIA_KIND, CALL_SIGNAL_KIND, CALL_STATUS } from './constants'

export type CallStatus = (typeof CALL_STATUS)[keyof typeof CALL_STATUS]

export type CallFlow = (typeof CALL_FLOW)[keyof typeof CALL_FLOW]

export type CallMediaKind = (typeof CALL_MEDIA_KIND)[keyof typeof CALL_MEDIA_KIND]

export type CallSignalKind = (typeof CALL_SIGNAL_KIND)[keyof typeof CALL_SIGNAL_KIND]

export type CallLeaveReason = (typeof CALL_LEAVE_REASON)[keyof typeof CALL_LEAVE_REASON]

export interface CallParticipantMediaState {
  audio: boolean
  video: boolean
  screen: boolean
}

export interface CallParticipant {
  userId: string
  socketId: string
  joinedAt: number
  leftAt?: number
  mediaState: CallParticipantMediaState
}

export interface RoomCall {
  id: string
  roomId: string
  initiatorId: string
  calledAt: number
  startedAt?: number
  finishedAt?: number
  status: CallStatus
  mediaKind: CallMediaKind
  participants: CallParticipant[]
}

export interface Call {
  id: string
  calledAt?: number
  authorId: string
  authorNickname: string
  startedAt: number
  finishedAt?: number
  length?: number
  interlocutorId: string
  interlocutorNickname: string
  interlocutorAvatarId?: MediaId
  status?: CallStatus
  flow: CallFlow
  video: boolean
  interlocutorSettings?: StreamSettings
  setId?: boolean
}

export interface EventMarkCallAsVideo {
  callId: string
}

export type EventCallsUpdated = Call[]

export type EventRoomCallsUpdated = RoomCall[]

export interface EventCallUser {
  callId?: string
  userToCall?: string
  signal: unknown
  from: string
  avatar: string
  callerNickname: string
}

export interface EventCallAccepted {
  signal: unknown
}

export interface EventAnswerCall {
  callId: string
  to: string
  signal: unknown
  selfSocketId: string
}

export type EventCallStartedAt = number

export interface EventCallEnded {
  callId: string
  callerId: string
}

export interface EventStartRoomCall {
  roomId: string
  mediaKind: CallMediaKind
}

export interface StartRoomCallAckPayload {
  callId: string
}

export interface EventJoinRoomCall {
  callId: string
}

export interface JoinRoomCallAckPayload {
  call: RoomCall
}

export interface EventLeaveRoomCall {
  callId: string
  reason: CallLeaveReason
}

export interface EventUpdateCallMediaState {
  callId: string
  mediaState: CallParticipantMediaState
}

export interface EventSendCallSignal {
  callId: string
  toUserId: string
  signalKind: CallSignalKind
  signal: unknown
}

export interface EventRoomCallStarted {
  call: RoomCall
}

export interface EventRoomCallJoined {
  callId: string
  participant: CallParticipant
}

export interface EventRoomCallLeft {
  callId: string
  userId: string
  reason: CallLeaveReason
}

export interface EventRoomCallEnded {
  callId: string
}

export interface EventRoomCallMediaStateUpdated {
  callId: string
  userId: string
  mediaState: CallParticipantMediaState
}

export interface EventCallSignalReceived {
  callId: string
  fromUserId: string
  signalKind: CallSignalKind
  signal: unknown
}
