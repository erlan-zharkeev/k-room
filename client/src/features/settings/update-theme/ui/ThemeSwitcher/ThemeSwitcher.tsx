import { useThemeUpdate, THEME_SWITCHER_I18N } from 'src/features/settings/update-theme'

import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/settings'

import { AppSwitch, AppText } from 'src/shared/ui'

export const ThemeSwitcher = () => {
  const { toggleTheme } = useThemeUpdate()
  const { isThemeDark } = useSettings()
  const { t } = useI18n()

  return (
    <div className="theme-switcher">
      <AppText size="small">{t(THEME_SWITCHER_I18N.label)}</AppText>
      <AppSwitch
        name="theme"
        onText={t(THEME_SWITCHER_I18N.dark)}
        offText={t(THEME_SWITCHER_I18N.light)}
        value={isThemeDark}
        onChange={toggleTheme}
      />
    </div>
  )
}
