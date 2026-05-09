import { computed } from 'vue'

import { db, dexieKeyValueStore } from 'src/shared/lib'

import { DEFAULT_SETTINGS } from '../config/constants'
import type { DbUserSettingType } from '../config/types'

const settingsStore = dexieKeyValueStore<DbUserSettingType>(db.settings, 'settings')

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
    await get()
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
