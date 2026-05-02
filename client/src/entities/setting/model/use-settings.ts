import { computed } from 'vue'

import type { DbUserSettingType } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

import { DEFAULT_SETTINGS } from '../config/constants'

const settingsStore = dexieKeyValueStore<DbUserSettingType>(db.settings, 'settings')

export const useSettings = () => {
  const { ensure, reset, setByPath, shallowUpdate } = settingsStore
  const settings = settingsStore.use(DEFAULT_SETTINGS)
  const isSelectedThemeCustom = computed(() => settings.value.appearance.selectedTheme === 'custom')
  const isSelectedThemeSystem = computed(() => settings.value.appearance.selectedTheme === 'system')
  const effectiveTheme = computed(() => {
    const { selectedTheme, systemTheme, themes } = settings.value.appearance
    return themes[selectedTheme === 'system' ? systemTheme : selectedTheme]
  })

  return {
    settings,
    isSelectedThemeCustom,
    isSelectedThemeSystem,
    effectiveTheme,
    initialize: () => ensure(DEFAULT_SETTINGS),
    reset: () => reset(DEFAULT_SETTINGS),
    shallowUpdate,
    setByPath
  }
}
