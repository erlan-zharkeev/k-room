import type { IUserSetting } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

import { DEFAULT_SETTINGS, FULL_CONTENT_ELEMENTS } from '..'

export const settingsStore = dexieKeyValueStore<IUserSetting>(db.settings, 'settings')

export const useSettings = () => {
  const settings = settingsStore.use<IUserSetting>(DEFAULT_SETTINGS)

  return {
    ...settings,
    isThemeDark: settings.theme === 'dark',
    showAsidePanel: !FULL_CONTENT_ELEMENTS.includes(settings.selectedContentTab),

    initialize: () => settingsStore.ensure(DEFAULT_SETTINGS),
    reset: () => settingsStore.reset(DEFAULT_SETTINGS),
    update: (changes: Partial<IUserSetting>) => settingsStore.updateShallow(changes),
    setByPath: (path: string, value: unknown) => settingsStore.setByPath(path, value)
  }
}
