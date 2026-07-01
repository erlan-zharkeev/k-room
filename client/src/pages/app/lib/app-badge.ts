import { getClientPlatform } from 'src/shared/lib'

import {
  APP_BADGE_OVERLAY_BACKGROUND_COLOR,
  APP_BADGE_OVERLAY_CANVAS_SIZE,
  APP_BADGE_OVERLAY_CENTER,
  APP_BADGE_OVERLAY_CIRCLE_RADIUS,
  APP_BADGE_OVERLAY_FONT_FAMILY,
  APP_BADGE_OVERLAY_FONT_SIZE_BY_LABEL_LENGTH,
  APP_BADGE_OVERLAY_FONT_SIZE_FALLBACK,
  APP_BADGE_OVERLAY_FONT_WEIGHT,
  APP_BADGE_OVERLAY_FULL_CIRCLE_ANGLE,
  APP_BADGE_OVERLAY_MAX_VISIBLE_COUNT,
  APP_BADGE_OVERLAY_TEXT_ALIGN,
  APP_BADGE_OVERLAY_TEXT_BASELINE,
  APP_BADGE_OVERLAY_TEXT_COLOR
} from './app-badge.constants'
import type { AppBadgeNavigator } from './app-badge.types'

const getBrowserAppBadgeNavigator = () => {
  const badgeNavigator = navigator as AppBadgeNavigator

  if (!badgeNavigator.setAppBadge || !badgeNavigator.clearAppBadge) return null

  return badgeNavigator
}

const syncBrowserAppBadge = async (unreadMessagesQuantity: number) => {
  const badgeNavigator = getBrowserAppBadgeNavigator()

  if (!badgeNavigator) return

  if (unreadMessagesQuantity > 0) {
    await badgeNavigator.setAppBadge(unreadMessagesQuantity)
    return
  }

  await badgeNavigator.clearAppBadge()
}

const getNativeOverlayBadgeLabel = (unreadMessagesQuantity: number) => {
  if (unreadMessagesQuantity > APP_BADGE_OVERLAY_MAX_VISIBLE_COUNT) return `${APP_BADGE_OVERLAY_MAX_VISIBLE_COUNT}+`

  return unreadMessagesQuantity.toString()
}

const getNativeOverlayBadgeFontSize = (label: string) => {
  return APP_BADGE_OVERLAY_FONT_SIZE_BY_LABEL_LENGTH[label.length - 1] ?? APP_BADGE_OVERLAY_FONT_SIZE_FALLBACK
}

const createNativeOverlayBadgeIcon = async (unreadMessagesQuantity: number) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return null

  const label = getNativeOverlayBadgeLabel(unreadMessagesQuantity)
  const fontSize = getNativeOverlayBadgeFontSize(label)

  canvas.width = APP_BADGE_OVERLAY_CANVAS_SIZE
  canvas.height = APP_BADGE_OVERLAY_CANVAS_SIZE

  context.clearRect(0, 0, APP_BADGE_OVERLAY_CANVAS_SIZE, APP_BADGE_OVERLAY_CANVAS_SIZE)
  context.fillStyle = APP_BADGE_OVERLAY_BACKGROUND_COLOR
  context.beginPath()
  context.arc(
    APP_BADGE_OVERLAY_CENTER,
    APP_BADGE_OVERLAY_CENTER,
    APP_BADGE_OVERLAY_CIRCLE_RADIUS,
    0,
    APP_BADGE_OVERLAY_FULL_CIRCLE_ANGLE
  )
  context.fill()
  context.fillStyle = APP_BADGE_OVERLAY_TEXT_COLOR
  context.font = `${APP_BADGE_OVERLAY_FONT_WEIGHT} ${fontSize}px ${APP_BADGE_OVERLAY_FONT_FAMILY}`
  context.textAlign = APP_BADGE_OVERLAY_TEXT_ALIGN
  context.textBaseline = APP_BADGE_OVERLAY_TEXT_BASELINE
  context.fillText(label, APP_BADGE_OVERLAY_CENTER, APP_BADGE_OVERLAY_CENTER)

  const { Image } = await import('@tauri-apps/api/image')
  const imageData = context.getImageData(0, 0, APP_BADGE_OVERLAY_CANVAS_SIZE, APP_BADGE_OVERLAY_CANVAS_SIZE)

  return Image.new(Uint8Array.from(imageData.data), APP_BADGE_OVERLAY_CANVAS_SIZE, APP_BADGE_OVERLAY_CANVAS_SIZE)
}

const syncNativeOverlayBadge = async (unreadMessagesQuantity: number) => {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  const window = getCurrentWindow()

  if (unreadMessagesQuantity <= 0) {
    await window.setOverlayIcon(undefined)
    return
  }

  const overlayIcon = await createNativeOverlayBadgeIcon(unreadMessagesQuantity)

  if (!overlayIcon) return

  await window.setOverlayIcon(overlayIcon)
  await overlayIcon.close()
}

const syncNativeAppBadge = async (unreadMessagesQuantity: number) => {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  const window = getCurrentWindow()

  try {
    if (unreadMessagesQuantity > 0) {
      await window.setBadgeCount(unreadMessagesQuantity)
      return
    }

    await window.setBadgeCount(undefined)
    return
  } catch (error) {
    void error
  }

  await syncNativeOverlayBadge(unreadMessagesQuantity)
}

export const syncAppBadge = async (unreadMessagesQuantity: number) => {
  try {
    const clientPlatform = getClientPlatform()

    if (clientPlatform === 'browser') {
      await syncBrowserAppBadge(unreadMessagesQuantity)
      return
    }

    await syncNativeAppBadge(unreadMessagesQuantity)
  } catch (error) {
    void error
  }
}
