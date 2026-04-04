import { DEFAULT_SETTINGS, FULL_CONTENT_ELEMENTS } from 'src/entities/settings'

import { IUserSetting } from 'src/shared/config'
import { dexieKeyValueStore, db } from 'src/shared/lib'

export const settingsStore = dexieKeyValueStore<IUserSetting>(db.settings, 'settings')

export const useSettings = () => {
  const { data: settings, isReady } = settingsStore.useState(DEFAULT_SETTINGS)
  const isThemeDark = settings.theme === 'dark'
  const showAsidePanel = !FULL_CONTENT_ELEMENTS.includes(settings.selectedContentTab)

  return {
    ...settings,
    isReady,
    isThemeDark,
    showAsidePanel,
    initialize: () => settingsStore.ensure(DEFAULT_SETTINGS),
    shallowUpdate: (changes: Partial<IUserSetting>) => settingsStore.shallowUpdate(changes)
  }
}
