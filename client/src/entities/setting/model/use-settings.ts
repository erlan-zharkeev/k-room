import { computed } from 'vue'

import type { DbUserSettingType } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

import { DEFAULT_SETTINGS } from '../config/constants'

const settingsStore = dexieKeyValueStore<DbUserSettingType>(db.settings, 'settings')

export const useSettings = () => {
  const { ensure, reset, setByPath, shallowUpdate } = settingsStore
  const settings = settingsStore.use(DEFAULT_SETTINGS)
  const language = computed(() => settings.value.language)
  const theme = computed(() => settings.value.theme)

  return {
    settings,
    language,
    theme,
    initialize: () => ensure(DEFAULT_SETTINGS),
    reset: () => reset(DEFAULT_SETTINGS),
    shallowUpdate,
    setByPath
  }
}
