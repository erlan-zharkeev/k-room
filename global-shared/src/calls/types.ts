import type { MediaId } from '../media/types'
import type { StreamSettings } from '../shared/types'

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
