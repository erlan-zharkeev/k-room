import type { PluginListener } from '@tauri-apps/api/core'
import type { Options as NativeNotificationOptions } from '@tauri-apps/plugin-notification'
import type { MediaId } from 'global-shared'

import type { NotificationGroupSettings } from 'src/entities/setting'
import { getClientPlatform } from 'src/shared/lib'

import { showBrowserPushWithImage } from './browser-push-image'
import type { BrowserPushMediaGetter } from './types'

let nativeNotificationPermissionRequest: Promise<boolean> | null = null
let nativeNotificationActionListener: Promise<PluginListener> | null = null

const createNativeNotificationId = (tag?: string) => {
  if (!tag) return

  let hash = 0

  Array.from(tag).forEach((symbol) => {
    hash = (hash * 31 + symbol.charCodeAt(0)) | 0
  })

  return Math.abs(hash) % 2_147_483_647 || undefined
}

const requestNativeNotificationPermission = async () => {
  const { isPermissionGranted, requestPermission } = await import('@tauri-apps/plugin-notification')

  if (await isPermissionGranted()) return true

  nativeNotificationPermissionRequest ??= requestPermission()
    .then((permission) => permission === 'granted')
    .finally(() => {
      nativeNotificationPermissionRequest = null
    })

  return nativeNotificationPermissionRequest
}

const showNativeMainWindow = async () => {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  const window = getCurrentWindow()

  await window.show()
  await window.setFocus()
}

const registerNativeNotificationActionListener = async () => {
  const { onAction } = await import('@tauri-apps/plugin-notification')

  return onAction(() => {
    void showNativeMainWindow()
  })
}

const watchNativeNotificationActions = () => {
  nativeNotificationActionListener ??= registerNativeNotificationActionListener().catch((error) => {
    nativeNotificationActionListener = null
    throw error
  })

  return nativeNotificationActionListener
}

const showNativePush = async (title: string, options: NotificationOptions) => {
  if (!(await requestNativeNotificationPermission())) return

  const { sendNotification } = await import('@tauri-apps/plugin-notification')
  const nativeOptions: NativeNotificationOptions = {
    title,
    id: createNativeNotificationId(options.tag),
    body: options.body
  }

  void watchNativeNotificationActions().catch((error) => {
    void error
  })
  sendNotification(nativeOptions)
}

export const isClientPushEnabled = (
  generalSettings: NotificationGroupSettings,
  groupSettings: NotificationGroupSettings
) => {
  const pushSettingKey = getClientPlatform() === 'native' ? 'nativePush' : 'browserPush'

  return generalSettings[pushSettingKey] && groupSettings[pushSettingKey]
}

export const showClientPushWithImage = async (
  title: string,
  options: NotificationOptions,
  imageId: MediaId,
  getMedia: BrowserPushMediaGetter
) => {
  if (getClientPlatform() === 'native') {
    await showNativePush(title, options)
    return
  }

  await showBrowserPushWithImage(title, options, imageId, getMedia)
}
