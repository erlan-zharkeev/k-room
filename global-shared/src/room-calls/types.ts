export type RoomCallStatus = 'calling' | 'in-progress' | 'finished'

export type RoomCallMediaKind = 'audio' | 'video' | 'screen'

export type RoomCallSignalKind = 'offer' | 'answer' | 'ice-candidate'

export type RoomCallQuickCommand = 'no' | 'ok' | 'raise-hand' | 'yes'

export type RoomCallTemporaryQuickCommand = 'no' | 'ok' | 'yes'

export type RoomCallLeaveReason = 'declined' | 'disconnected' | 'left'

export type RoomCallAckFailureReason = 'access-failed' | 'already-active' | 'join-failed' | 'limit-reached'

export interface RoomCallParticipantMediaState {
  audio: boolean
  video: boolean
  screen: boolean
}

export interface RoomCallParticipantQuickCommandState {
  handRaised: boolean
}

export type RoomCallParticipantQuickCommandStateByUserId = Record<string, RoomCallParticipantQuickCommandState>

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
  participantQuickCommandStateByUserId: RoomCallParticipantQuickCommandStateByUserId
}

export interface EventLeaveRoomCall {
  roomCallId: string
  reason: RoomCallLeaveReason
}

export interface EventDeclineRoomCall {
  roomCallId: string
}

export interface EventMarkRoomCallsAsSeen {
  lastSeenMissedRoomCallCalledAt: number
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

export interface EventSendRoomCallQuickCommand {
  roomCallId: string
  quickCommand: RoomCallTemporaryQuickCommand
}

export interface EventSetRoomCallHandRaised {
  roomCallId: string
  handRaised: boolean
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
  mediaKind: RoomCallMediaKind
  mediaState: RoomCallParticipantMediaState
}

export interface EventRoomCallQuickCommandReceived {
  roomCallId: string
  userId: string
  quickCommand: RoomCallTemporaryQuickCommand
  createdAt: number
}

export interface EventRoomCallHandRaisedUpdated {
  roomCallId: string
  userId: string
  handRaised: boolean
  updatedAt: number
}

export interface EventRoomCallSignalReceived {
  roomCallId: string
  fromUserId: string
  signalKind: RoomCallSignalKind
  signal: unknown
}
