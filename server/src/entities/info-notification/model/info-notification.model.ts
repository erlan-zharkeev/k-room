import { model, Schema } from 'mongoose'

import { type IInfoNotification } from 'common'

const localizedTextSchema = {
  en: {
    type: String,
    required: true
  },
  ru: {
    type: String,
    required: true
  }
} as const

const localizedParagraphsSchema = {
  en: {
    type: [String],
    required: true,
    default: []
  },
  ru: {
    type: [String],
    required: true,
    default: []
  }
} as const

const infoNotificationSchema = new Schema<IInfoNotification>(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    title: localizedTextSchema,
    content: localizedParagraphsSchema,
    isActive: {
      type: Boolean,
      required: true,
      default: true
    },
    createdAt: {
      type: Number,
      required: true,
      default: () => Date.now()
    },
    updatedAt: {
      type: Number,
      required: true,
      default: () => Date.now()
    }
  },
  {}
)

export const InfoNotificationModel = model('InfoNotification', infoNotificationSchema, 'info-notification')
