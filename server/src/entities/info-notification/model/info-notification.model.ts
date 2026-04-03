import { model, Schema, Types } from 'mongoose'

import { IInfoNotification } from 'common'

type IInfoNotificationDocument = Omit<IInfoNotification, 'id'> & {
  _id: Types.ObjectId
}

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

const infoNotificationSchema = new Schema<IInfoNotificationDocument>(
  {
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
  {
    id: false
  }
)

export const InfoNotificationModel = model('InfoNotification', infoNotificationSchema, 'info-notification')
