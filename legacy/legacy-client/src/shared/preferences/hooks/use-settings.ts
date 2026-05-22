import { UserSetting } from 'src/shared/config'
import { dexieKeyValueStore, db } from 'src/shared/lib'
import { DEFAULT_SETTINGS, FULL_CONTENT_ELEMENTS } from 'src/shared/preferences/internals/constants'

const settingsStore = dexieKeyValueStore<UserSetting>(db.settings, 'settings')

export const useSettings = () => {
  const { shallowUpdate } = settingsStore
  const { data: settings, isReady } = settingsStore.useState(DEFAULT_SETTINGS)
  const isThemeDark = settings.theme === 'dark'
  const showAsidePanel = !FULL_CONTENT_ELEMENTS.includes(settings.selectedContentTab)

  return {
    ...settings,
    isReady,
    isThemeDark,
    showAsidePanel,
    initialize: () => settingsStore.ensure(DEFAULT_SETTINGS),
    shallowUpdate
  }
}
