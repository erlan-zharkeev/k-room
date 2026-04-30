import type { IStreamSettings } from '../shared/types'

export type CallStatusType = 'calling' | 'in-progress' | 'finished'

export type CallFlowType = 'incoming' | 'outgoing' | 'missed' | 'not-answered'

export interface ICall {
  id: string
  calledAt?: number
  authorId: string
  authorNickname: string
  startedAt: number
  finishedAt?: number
  length?: number
  interlocutorId: string
  interlocutorNickname: string
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

export type IDBCallSchema = IDBCall
