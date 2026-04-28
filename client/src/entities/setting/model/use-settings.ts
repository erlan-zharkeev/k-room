import { computed } from 'vue'

import { DEFAULT_DARK_WALLPAPER, DEFAULT_LIGHT_WALLPAPER } from 'src/shared/assets'
import type { DbUserSettingType } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

import { DEFAULT_SETTINGS } from '../config/constants'

const settingsStore = dexieKeyValueStore<DbUserSettingType>(db.settings, 'settings')

export const useSettings = () => {
  const { ensure, reset, setByPath, shallowUpdate } = settingsStore
  const settings = settingsStore.use(DEFAULT_SETTINGS)
  const language = computed(() => settings.value.language)
  const theme = computed(() => settings.value.theme)

  const defaultWallpaper = computed(() => {
    const effectiveTheme = settings.value.theme === 'system' ? settings.value.systemTheme : settings.value.theme

    return effectiveTheme === 'light' ? DEFAULT_LIGHT_WALLPAPER : DEFAULT_DARK_WALLPAPER
  })

  const selectedWallpaper = computed(() => {
    if (settings.value.wallpaper === 'custom') return settings.value.customWallpaperDataUrl

    return defaultWallpaper.value
  })
  return {
    settings,
    language,
    theme,
    selectedWallpaper,
    initialize: () => ensure(DEFAULT_SETTINGS),
    reset: () => reset(DEFAULT_SETTINGS),
    shallowUpdate,
    setByPath
  }
}
