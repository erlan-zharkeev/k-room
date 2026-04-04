import { DEFAULT_SETTINGS, FULL_CONTENT_ELEMENTS } from 'src/entities/settings'

import { IUserSetting } from 'src/shared/config'
import { dexieKeyValueStore, db } from 'src/shared/lib'

export const settingsStore = dexieKeyValueStore<IUserSetting>(db.settings, 'settings')

export const useSettings = () => {
  const { data: settings, isReady } = settingsStore.useState(DEFAULT_SETTINGS)

  return {
    ...settings,
    isReady,
    isThemeDark: settings.theme === 'dark',
    showAsidePanel: !FULL_CONTENT_ELEMENTS.includes(settings.selectedContentTab),
    initialize: () => settingsStore.ensure(DEFAULT_SETTINGS),
    update: (changes: Partial<IUserSetting>) => settingsStore.update(changes),
    setByPath: (path: string, value: unknown) => settingsStore.setByPath(path, value)
  }
}
