import { useLiveQuery } from 'dexie-react-hooks'

import { type IUserSettings, db } from 'src/shared/lib'

import { DEFAULT_SETTINGS, FULL_CONTENT_ELEMENTS } from '..'

export const useSettings = () => {
  const settings = useLiveQuery(async () => {
    const store = await db.settings.get('settings')
    return store
  })

  const initialize = async () => {
    const hasSettings = await db.settings.toCollection().first()
    if (!hasSettings) {
      await db.settings.put({ ...DEFAULT_SETTINGS, id: 'settings' })
    }
  }

  const updateSetting = async (setting: Partial<IUserSettings>) => {
    if (!settings) return
    await db.settings.put({ ...settings, ...setting, id: 'settings' })
  }

  const reset = async () => {
    await db.settings.put({ ...DEFAULT_SETTINGS, id: 'settings' })
  }

  const mergedSettings: IUserSettings = {
    ...DEFAULT_SETTINGS,
    ...settings
  }

  const {
    selectedContentTab,
    selectedChatRoomId,
    soundOn,
    theme,
    showWallpaper,
    showTooltips,
    showNotification,
    selectedAudioInputDeviceId,
    selectedVideoInputDeviceId,
    selectedAudioOutputDeviceId
  } = mergedSettings

  const showAsidePanel = !FULL_CONTENT_ELEMENTS.includes(selectedContentTab)
  const isThemeDark = theme === 'dark'

  return {
    selectedContentTab,
    selectedChatRoomId,
    soundOn,
    theme,
    showWallpaper,
    showTooltips,
    showNotification,
    selectedAudioInputDeviceId,
    selectedVideoInputDeviceId,
    selectedAudioOutputDeviceId,
    showAsidePanel,
    isThemeDark,
    updateSetting,
    reset,
    initialize
  }
}
