import type { StreamSettings } from '../shared/types'
import type { MediaId } from '../media/types'

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

export interface CallDocument {
  _id: string
  calledAt: number
  startedAt: number
  finishedAt: number
  authorId: string
  interlocutors: string[]
  answered: boolean
  video: boolean
}

export type CallSchema = CallDocument
