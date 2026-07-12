import { computed } from 'vue'

import { db, dexieKeyValueStore } from 'src/shared/lib'

import {
  DARK_COLOR_SCHEMA,
  DARK_WALLPAPER_SETTINGS,
  LIGHT_COLOR_SCHEMA,
  LIGHT_WALLPAPER_SETTINGS
} from '../config/appearance.constants'
import type { ColorSchema, WallpaperSettings } from '../config/appearance.types'
import { DEFAULT_SETTINGS } from '../config/constants'
import { DEFAULT_NOTIFICATION_SETTINGS } from '../config/notification.constants'
import type { DeviceNotificationSettings, NotificationSettingGroup } from '../config/notification.types'
import type { DeviceSetting } from '../config/types'

const settingsStore = dexieKeyValueStore<DeviceSetting>(db.settings, 'settings')

const isWallpaperSynced = (wallpaper: WallpaperSettings, defaultWallpaper: WallpaperSettings) =>
  wallpaper.url === defaultWallpaper.url && wallpaper.filename === defaultWallpaper.filename

const isColorSchemaSynced = (colorSchema: ColorSchema, defaultColorSchema: ColorSchema) =>
  Object.entries(defaultColorSchema).every(([key, value]) => colorSchema[key as keyof ColorSchema] === value)

const syncNotificationGroupSettings = (notifications: DeviceNotificationSettings, group: NotificationSettingGroup) => {
  if (!hasMissingNotificationGroupSettings(notifications, group)) return

  const defaults = DEFAULT_NOTIFICATION_SETTINGS[group]
  const current = notifications[group]
  notifications[group] = { ...defaults, ...current }
}

const hasMissingNotificationGroupSettings = (
  notifications: DeviceNotificationSettings,
  group: NotificationSettingGroup
) => {
  const defaults = DEFAULT_NOTIFICATION_SETTINGS[group]
  const current = notifications[group]

  return !current || Object.keys(defaults).some((key) => !(key in current))
}

const hasBrowserPushPermissionPromptSetting = (notifications: DeviceNotificationSettings) =>
  Object.prototype.hasOwnProperty.call(notifications, 'browserPushPermissionPromptDismissed')

const hasMissingNotificationSettings = (notifications: DeviceNotificationSettings) => {
  return (
    !hasBrowserPushPermissionPromptSetting(notifications) ||
    hasMissingNotificationGroupSettings(notifications, 'general') ||
    hasMissingNotificationGroupSettings(notifications, 'messages') ||
    hasMissingNotificationGroupSettings(notifications, 'calls') ||
    hasMissingNotificationGroupSettings(notifications, 'groupCalls') ||
    hasMissingNotificationGroupSettings(notifications, 'invites')
  )
}

const syncNotificationSettings = (notifications: DeviceNotificationSettings) => {
  if (!hasBrowserPushPermissionPromptSetting(notifications)) {
    notifications.browserPushPermissionPromptDismissed =
      DEFAULT_NOTIFICATION_SETTINGS.browserPushPermissionPromptDismissed
  }

  syncNotificationGroupSettings(notifications, 'general')
  syncNotificationGroupSettings(notifications, 'messages')
  syncNotificationGroupSettings(notifications, 'calls')
  syncNotificationGroupSettings(notifications, 'groupCalls')
  syncNotificationGroupSettings(notifications, 'invites')
}

export const useSettings = () => {
  const { ensure, get, mutate, reset, setByPath, shallowUpdate } = settingsStore
  const settings = settingsStore.use(DEFAULT_SETTINGS)
  const isSelectedThemeCustom = computed(() => settings.value.appearance.selectedTheme === 'custom')
  const isSelectedThemeSystem = computed(() => settings.value.appearance.selectedTheme === 'system')
  const effectiveTheme = computed(() => {
    const { selectedTheme, systemTheme, themes } = settings.value.appearance
    return themes[selectedTheme === 'system' ? systemTheme : selectedTheme]
  })

  const initialize = async () => {
    await ensure(DEFAULT_SETTINGS)
    const initializedSettings = await get()

    if (!initializedSettings) return

    const { dark, light } = initializedSettings.appearance.themes
    const isDarkWallpaperSynced = isWallpaperSynced(dark.wallpaper, DARK_WALLPAPER_SETTINGS)
    const isLightWallpaperSynced = isWallpaperSynced(light.wallpaper, LIGHT_WALLPAPER_SETTINGS)
    const isDarkColorSchemaSynced = isColorSchemaSynced(dark.colorSchema, DARK_COLOR_SCHEMA)
    const isLightColorSchemaSynced = isColorSchemaSynced(light.colorSchema, LIGHT_COLOR_SCHEMA)

    if (hasMissingNotificationSettings(initializedSettings.notifications)) {
      await mutate((data) => {
        syncNotificationSettings(data.notifications)
      })
    }

    if (isDarkWallpaperSynced && isLightWallpaperSynced && isDarkColorSchemaSynced && isLightColorSchemaSynced) return

    await mutate((data) => {
      if (!isDarkColorSchemaSynced) {
        data.appearance.themes.dark.colorSchema = { ...DARK_COLOR_SCHEMA }
      }

      if (!isLightColorSchemaSynced) {
        data.appearance.themes.light.colorSchema = { ...LIGHT_COLOR_SCHEMA }
      }

      if (!isDarkWallpaperSynced) {
        data.appearance.themes.dark.wallpaper = { ...DARK_WALLPAPER_SETTINGS }
      }

      if (!isLightWallpaperSynced) {
        data.appearance.themes.light.wallpaper = { ...LIGHT_WALLPAPER_SETTINGS }
      }
    })
  }

  return {
    settings,
    isSelectedThemeCustom,
    isSelectedThemeSystem,
    effectiveTheme,
    initialize,
    mutate,
    reset: () => reset(DEFAULT_SETTINGS),
    shallowUpdate,
    setByPath
  }
}
