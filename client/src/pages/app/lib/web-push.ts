import type { WebPushSubscriptionEnabledGroups, WebPushSubscriptionPayload } from 'global-shared'

import { getClientPlatform } from 'src/shared/lib'

export const isWebPushSupported = () => {
  if (getClientPlatform() !== 'browser') return false

  return 'Notification' in window && 'PushManager' in window && 'serviceWorker' in navigator
}

export const hasEnabledWebPushGroups = ({ calls, messages }: WebPushSubscriptionEnabledGroups) => {
  return calls || messages
}

export const urlBase64ToUint8Array = (value: string) => {
  const padding = '='.repeat((4 - (value.length % 4)) % 4)
  const base64 = `${value}${padding}`.replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)

  return Uint8Array.from(rawData, (symbol) => symbol.charCodeAt(0))
}

const getExistingWebPushServiceWorkerRegistration = async () => {
  if (!isWebPushSupported()) return null

  return navigator.serviceWorker.getRegistration('/')
}

const getWebPushServiceWorkerRegistration = async () => {
  if (!isWebPushSupported()) return null

  const currentRegistration = await getExistingWebPushServiceWorkerRegistration()

  return currentRegistration ?? navigator.serviceWorker.register('/sw.js')
}

export const getCurrentWebPushSubscription = async () => {
  const registration = await getExistingWebPushServiceWorkerRegistration()

  return registration?.pushManager.getSubscription() ?? null
}

export const deleteCurrentWebPushSubscription = async () => {
  const subscription = await getCurrentWebPushSubscription()
  const endpoint = subscription?.endpoint

  if (!subscription) return null

  await subscription.unsubscribe()

  return endpoint ? { endpoint } : null
}

export const subscribeToWebPush = async (publicKey: string) => {
  if (!isWebPushSupported()) return null
  if (Notification.permission !== 'granted') return null

  const registration = await getWebPushServiceWorkerRegistration()

  if (!registration) return null

  const currentSubscription = await registration.pushManager.getSubscription()

  if (currentSubscription) return currentSubscription

  return registration.pushManager.subscribe({
    applicationServerKey: urlBase64ToUint8Array(publicKey),
    userVisibleOnly: true
  })
}

export const buildWebPushSubscriptionPayload = (
  subscription: PushSubscription,
  enabledGroups: WebPushSubscriptionEnabledGroups
): WebPushSubscriptionPayload | null => {
  const subscriptionData = subscription.toJSON()
  const { endpoint, expirationTime, keys } = subscriptionData

  if (!endpoint || !keys?.auth || !keys.p256dh) return null

  return {
    endpoint,
    expirationTime: expirationTime ?? null,
    keys: {
      auth: keys.auth,
      p256dh: keys.p256dh
    },
    enabledGroups,
    userAgent: navigator.userAgent
  }
}
