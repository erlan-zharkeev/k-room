import type { MediaId } from '../media/types'
import type { BasicStreamSettings, StreamSettings } from '../shared/types'

export type CallStatus = 'calling' | 'in-progress' | 'finished'

export type CallFlow = 'incoming' | 'outgoing' | 'missed' | 'not-answered'

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
