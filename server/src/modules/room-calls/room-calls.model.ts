import { ROOM_CALL_MEDIA_KIND, ROOM_CALL_STATUS } from 'global-shared'
import { model, Schema } from 'mongoose'

import type { RoomCallParticipantMediaStateSchema, RoomCallParticipantSchema, RoomCallSchema } from './room-calls.types'

const roomCallParticipantMediaStateSchema = new Schema<RoomCallParticipantMediaStateSchema>(
  {
    audio: {
      type: Boolean,
      required: true
    },
    video: {
      type: Boolean,
      required: true
    },
    screen: {
      type: Boolean,
      required: true
    }
  },
  { _id: false }
)

const roomCallParticipantSchema = new Schema<RoomCallParticipantSchema>(
  {
    userId: {
      type: String,
      required: true
    },
    socketId: {
      type: String,
      required: true
    },
    joinedAt: {
      type: Number,
      required: true
    },
    leftAt: {
      type: Number,
      required: false
    },
    mediaState: {
      type: roomCallParticipantMediaStateSchema,
      required: true
    }
  },
  { _id: false }
)

const roomCallSchema = new Schema<RoomCallSchema>(
  {
    calledAt: {
      type: Number,
      required: true
    },
    startedAt: {
      type: Number,
      required: false
    },
    finishedAt: {
      type: Number,
      required: false
    },
    roomId: {
      type: String,
      required: true
    },
    initiatorId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ROOM_CALL_STATUS),
      required: true
    },
    mediaKind: {
      type: String,
      enum: Object.values(ROOM_CALL_MEDIA_KIND),
      required: true
    },
    participants: {
      type: [roomCallParticipantSchema],
      required: true,
      default: []
    }
  },
  { versionKey: false }
)

roomCallSchema.index({ roomId: 1, status: 1 })
roomCallSchema.index({ roomId: 1, calledAt: -1 })
roomCallSchema.index({ roomId: 1 }, { unique: true, partialFilterExpression: { finishedAt: { $exists: false } } })

export const RoomCallModel = model<RoomCallSchema>('RoomCall', roomCallSchema, 'room-call')
