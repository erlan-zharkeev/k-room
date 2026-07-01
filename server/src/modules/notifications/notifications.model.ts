import { model, Schema } from 'mongoose'

import type { WebPushSubscriptionSchema } from './notifications.types'

const webPushSubscriptionKeysSchema = new Schema(
  {
    auth: {
      type: String,
      required: true
    },
    p256dh: {
      type: String,
      required: true
    }
  },
  { _id: false }
)

const webPushSubscriptionEnabledGroupsSchema = new Schema(
  {
    calls: {
      type: Boolean,
      required: true
    },
    messages: {
      type: Boolean,
      required: true
    }
  },
  { _id: false }
)

const webPushSubscriptionSchema = new Schema<WebPushSubscriptionSchema>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    endpoint: {
      type: String,
      required: true,
      unique: true
    },
    expirationTime: {
      type: Number,
      required: false,
      default: null
    },
    keys: {
      type: webPushSubscriptionKeysSchema,
      required: true
    },
    enabledGroups: {
      type: webPushSubscriptionEnabledGroupsSchema,
      required: true
    },
    userAgent: {
      type: String,
      required: false,
      default: ''
    },
    createdAt: {
      type: Number,
      required: true
    },
    updatedAt: {
      type: Number,
      required: true
    }
  },
  { versionKey: false }
)

export const WebPushSubscriptionModel = model<WebPushSubscriptionSchema>(
  'WebPushSubscription',
  webPushSubscriptionSchema,
  'web-push-subscription'
)
