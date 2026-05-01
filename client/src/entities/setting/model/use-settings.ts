import { computed } from 'vue'

import { DEFAULT_DARK_WALLPAPER, DEFAULT_LIGHT_WALLPAPER } from 'src/shared/assets'
import type { DbUserSettingType } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

import { DEFAULT_SETTINGS } from '../config/constants'

const settingsStore = dexieKeyValueStore<DbUserSettingType>(db.settings, 'settings')

export const useSettings = () => {
  const { ensure, reset, setByPath, shallowUpdate } = settingsStore
  const settings = settingsStore.use(DEFAULT_SETTINGS)

  const selectedWallpaper = computed(() => {
    if (settings.value.theme === 'custom') return settings.value.customWallpaperDataUrl || undefined

    const effectiveTheme = settings.value.theme === 'system' ? settings.value.systemTheme : settings.value.theme

    return effectiveTheme === 'light' ? DEFAULT_LIGHT_WALLPAPER : DEFAULT_DARK_WALLPAPER
  })
  return {
    settings,
    selectedWallpaper,
    initialize: () => ensure(DEFAULT_SETTINGS),
    reset: () => reset(DEFAULT_SETTINGS),
    shallowUpdate,
    setByPath
  }
}
