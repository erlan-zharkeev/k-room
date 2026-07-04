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
import { DEFAULT_NOTIFICATION_GROUP_SETTINGS } from '../config/notification.constants'
import type { DeviceSetting } from '../config/types'

const settingsStore = dexieKeyValueStore<DeviceSetting>(db.settings, 'settings')

const isWallpaperSynced = (wallpaper: WallpaperSettings, defaultWallpaper: WallpaperSettings) =>
  wallpaper.url === defaultWallpaper.url && wallpaper.filename === defaultWallpaper.filename

const isColorSchemaSynced = (colorSchema: ColorSchema, defaultColorSchema: ColorSchema) =>
  Object.entries(defaultColorSchema).every(([key, value]) => colorSchema[key as keyof ColorSchema] === value)

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

    const isInviteNotificationsSynced = 'invites' in initializedSettings.notifications
    const { dark, light } = initializedSettings.appearance.themes
    const isDarkWallpaperSynced = isWallpaperSynced(dark.wallpaper, DARK_WALLPAPER_SETTINGS)
    const isLightWallpaperSynced = isWallpaperSynced(light.wallpaper, LIGHT_WALLPAPER_SETTINGS)
    const isDarkColorSchemaSynced = isColorSchemaSynced(dark.colorSchema, DARK_COLOR_SCHEMA)
    const isLightColorSchemaSynced = isColorSchemaSynced(light.colorSchema, LIGHT_COLOR_SCHEMA)

    if (!isInviteNotificationsSynced) {
      await mutate((data) => {
        data.notifications.invites = { ...DEFAULT_NOTIFICATION_GROUP_SETTINGS }
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
