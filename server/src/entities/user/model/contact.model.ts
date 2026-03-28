import { Schema } from 'mongoose'

import { InteractionType } from 'common'

import type { IContact } from './../config'

const interactionValues: InteractionType[] = [
  'default',
  'invited',
  'invite-accepted',
  'invite-hidden',
  'invite-received'
]

export const contactSchema = new Schema<IContact>(
  {
    id: {
      type: String,
      required: true
    },
    interaction: {
      type: String,
      enum: interactionValues,
      required: true,
      default: 'default'
    },
    updatedAt: {
      type: Number,
      required: true
    }
  },
  { _id: false }
)
