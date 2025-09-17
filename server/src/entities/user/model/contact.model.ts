import { InteractionType } from 'common-types'
import { Schema } from 'mongoose'

import { IContact } from '../config/types'

const interactionValues: InteractionType[] = [
  "default",
  "invited",
  "invite-accepted",
  "invite-hidden",
  "invite-received"
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
