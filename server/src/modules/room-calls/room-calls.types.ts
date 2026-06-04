import type { RoomCall, RoomCallMediaKind, RoomCallParticipant, RoomCallStatus } from 'global-shared'
import type { Types } from 'mongoose'

export interface RoomCallSchema {
  calledAt: number
  startedAt?: number
  finishedAt?: number
  roomId: string
  initiatorId: string
  status: RoomCallStatus
  mediaKind: RoomCallMediaKind
  participants: RoomCallParticipantSchema[]
}

export interface RoomCallDocument extends RoomCallSchema {
  _id: Types.ObjectId
}

export type RoomCallParticipantMediaStateSchema = RoomCallParticipant['mediaState']

export type RoomCallParticipantSchema = RoomCallParticipant

export interface RoomCallActiveParticipant extends RoomCallParticipant {
  serverInstanceId: string
}

export interface RoomCallActiveState extends Omit<RoomCall, 'participants'> {
  participants: RoomCallActiveParticipant[]
}
