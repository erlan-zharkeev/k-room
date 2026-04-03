import { useLiveQuery } from 'dexie-react-hooks'

import { DEFAULT_SETTINGS, FULL_CONTENT_ELEMENTS } from 'src/entities/settings'

import { IUserSetting } from 'src/shared/config'
import { dexieKeyValueStore, db } from 'src/shared/lib'

export const settingsStore = dexieKeyValueStore<IUserSetting>(db.settings, 'settings')

export const useSettings = () => {
  const settings = settingsStore.use<IUserSetting>(DEFAULT_SETTINGS)
  const settingsEntry = useLiveQuery(async () => await db.settings.get('settings'), [], null)

  return {
    ...settings,
    isReady: settingsEntry !== null,
    isThemeDark: settings.theme === 'dark',
    showAsidePanel: !FULL_CONTENT_ELEMENTS.includes(settings.selectedContentTab),

    initialize: () => settingsStore.ensure(DEFAULT_SETTINGS),
    update: (changes: Partial<IUserSetting>) => settingsStore.updateShallow(changes),
    setByPath: (path: string, value: unknown) => settingsStore.setByPath(path, value)
  }
}
