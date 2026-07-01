export interface WebPushSubscriptionKeysPayload {
  auth: string
  p256dh: string
}

export interface WebPushSubscriptionEnabledGroups {
  calls: boolean
  messages: boolean
}

export interface WebPushSubscriptionPayload {
  endpoint: string
  expirationTime: number | null
  keys: WebPushSubscriptionKeysPayload
  enabledGroups: WebPushSubscriptionEnabledGroups
  userAgent?: string
}

export interface DeleteWebPushSubscriptionPayload {
  endpoint: string
}

export interface WebPushConfigResponse {
  enabled: boolean
  publicKey: string
}

export interface WebPushNotificationPayload {
  title: string
  badgeCount?: number
  options: {
    body?: string
    tag?: string
    data?: {
      url?: string
    }
  }
}
