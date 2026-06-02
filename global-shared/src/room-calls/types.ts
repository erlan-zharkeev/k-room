import type {
  ROOM_CALL_ACK_FAILURE_REASON,
  ROOM_CALL_LEAVE_REASON,
  ROOM_CALL_MEDIA_KIND,
  ROOM_CALL_SIGNAL_KIND,
  ROOM_CALL_STATUS
} from './constants'

export type RoomCallStatus = (typeof ROOM_CALL_STATUS)[keyof typeof ROOM_CALL_STATUS]

export type RoomCallMediaKind = (typeof ROOM_CALL_MEDIA_KIND)[keyof typeof ROOM_CALL_MEDIA_KIND]

export type RoomCallSignalKind = (typeof ROOM_CALL_SIGNAL_KIND)[keyof typeof ROOM_CALL_SIGNAL_KIND]

export type RoomCallLeaveReason = (typeof ROOM_CALL_LEAVE_REASON)[keyof typeof ROOM_CALL_LEAVE_REASON]

export type RoomCallAckFailureReason = (typeof ROOM_CALL_ACK_FAILURE_REASON)[keyof typeof ROOM_CALL_ACK_FAILURE_REASON]

export interface RoomCallParticipantMediaState {
  audio: boolean
  video: boolean
  screen: boolean
}

export interface RoomCallParticipant {
  userId: string
  socketId: string
  joinedAt: number
  leftAt?: number
  mediaState: RoomCallParticipantMediaState
}

export interface RoomCall {
  id: string
  roomId: string
  initiatorId: string
  calledAt: number
  startedAt?: number
  finishedAt?: number
  status: RoomCallStatus
  mediaKind: RoomCallMediaKind
  participants: RoomCallParticipant[]
}

export type EventRoomCallsUpdated = RoomCall[]

export interface EventLoadRoomCalls {
  query: string
  limit: number
  beforeCalledAt?: number
}

export interface EventRoomCallsLoaded {
  roomCalls: RoomCall[]
  nextBeforeCalledAt: number | null
  hasMore: boolean
}

export interface EventStartRoomCall {
  roomId: string
  mediaKind: RoomCallMediaKind
}

export interface StartRoomCallAckPayload {
  roomCallId: string
}

export interface EventJoinRoomCall {
  roomCallId: string
}

export interface JoinRoomCallAckPayload {
  roomCall: RoomCall
}

export interface EventLeaveRoomCall {
  roomCallId: string
  reason: RoomCallLeaveReason
}

export interface EventDeclineRoomCall {
  roomCallId: string
}

export interface EventUpdateRoomCallMediaState {
  roomCallId: string
  mediaState: RoomCallParticipantMediaState
}

export interface EventSendRoomCallSignal {
  roomCallId: string
  toUserId: string
  signalKind: RoomCallSignalKind
  signal: unknown
}

export interface EventRoomCallStarted {
  roomCall: RoomCall
}

export interface EventRoomCallJoined {
  roomCallId: string
  participant: RoomCallParticipant
  startedAt: number
}

export interface EventRoomCallLeft {
  roomCallId: string
  userId: string
  reason: RoomCallLeaveReason
  leftAt: number
}

export interface EventRoomCallDeclined {
  roomCallId: string
  userId: string
}

export interface EventRoomCallEnded {
  roomCallId: string
  finishedAt: number
}

export interface EventRoomCallMediaStateUpdated {
  roomCallId: string
  userId: string
  mediaState: RoomCallParticipantMediaState
}

export interface EventRoomCallSignalReceived {
  roomCallId: string
  fromUserId: string
  signalKind: RoomCallSignalKind
  signal: unknown
}
