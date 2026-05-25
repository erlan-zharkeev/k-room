import type { Types } from 'mongoose'

export interface CallSchema {
  calledAt: number
  startedAt?: number
  finishedAt?: number
  authorId: string
  interlocutors: string[]
  answered: boolean
  video: boolean
}

export interface CallDocument extends CallSchema {
  _id: Types.ObjectId
}
