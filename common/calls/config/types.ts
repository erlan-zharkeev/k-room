import type { IStreamSettings } from 'common/shared'

export type CallStatusType = 'calling' | 'in-progress' | 'finished'

export type CallFlowType = 'incoming' | 'outgoing' | 'missed' | 'not-answered'

export interface ICall {
  id: string
  calledAt?: number
  authorId: string
  authorName: string
  startedAt: number
  finishedAt?: number
  length?: number
  interlocutorId: string
  interlocutorName: string
  interlocutorAvatarPath?: string
  status?: CallStatusType
  flow: CallFlowType
  video: boolean
  interlocutorSettings?: IStreamSettings
  setId?: boolean
}

export interface IDBCall {
  _id: string
  calledAt: number
  startedAt: number
  finishedAt: number
  authorId: string
  interlocutors: string[]
  answered: boolean
  video: boolean
}

export interface IDBCallSchema extends IDBCall {}
