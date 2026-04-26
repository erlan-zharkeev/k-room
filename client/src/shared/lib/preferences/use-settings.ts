import type { AppLanguageType } from 'global-shared'
import { computed } from 'vue'

import { DEFAULT_SETTINGS, type DbUserSettingType } from 'src/shared/config'
import { isThemeType } from 'src/shared/lib/theme/is-theme-type'
import type { CustomThemeColorType, ThemeType } from 'src/shared/types/theme'

import { db, dexieKeyValueStore } from '../db'
import { setClientLanguage } from '../i18n/language'

const settingsStore = dexieKeyValueStore<DbUserSettingType>(db.settings, 'settings')

const normalizeTheme = (theme: unknown): ThemeType => (isThemeType(theme) ? theme : 'system')

export const useSettings = () => {
  const { ensure, reset, setByPath, shallowUpdate } = settingsStore
  const settings = settingsStore.use(DEFAULT_SETTINGS)
  const language = computed(() => settings.value.language)
  const theme = computed(() => settings.value.theme)

  const updateLanguage = async (nextLanguage: AppLanguageType) => {
    setClientLanguage(nextLanguage)
    await setByPath('language', nextLanguage)
  }

  const updateTheme = async (nextTheme: ThemeType) => {
    await setByPath('theme', nextTheme)
  }

  const updateCustomThemeColor = async (colorName: CustomThemeColorType, value: string) => {
    await setByPath(`customTheme.${colorName}`, value)
  }

  const initialize = async () => {
    await ensure(DEFAULT_SETTINGS)
    const current = await settingsStore.get()

    if (current) {
      setClientLanguage(current.language)
      const theme = normalizeTheme(current.theme)

      if (theme !== current.theme) {
        await setByPath('theme', theme)
      }

      if ((current.wallpaper as unknown) === 'legacy') {
        await setByPath('wallpaper', 'default')
      }
    }
  }

  return {
    settings,
    language,
    theme,
    initialize,
    reset: () => reset(DEFAULT_SETTINGS),
    shallowUpdate,
    setByPath,
    updateLanguage,
    updateTheme,
    updateCustomThemeColor
  }
}
