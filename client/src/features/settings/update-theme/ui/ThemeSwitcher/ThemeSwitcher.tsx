
import { useThemeUpdate } from 'src/features/settings/update-theme/hooks'
import { THEME_SWITCHER_TEXT } from 'src/features/settings/update-theme/ui/ThemeSwitcher/config'

import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { AppSwitch, AppText } from 'src/shared/ui'

export const ThemeSwitcher = () => {
  const { toggleTheme } = useThemeUpdate()
  const { isThemeDark } = useSettings()
  const { t } = useI18n()

  return (
    <div className="theme-switcher">
      <AppText size="small">{t(THEME_SWITCHER_TEXT.label)}</AppText>
      <AppSwitch
        name="theme"
        onText={t(THEME_SWITCHER_TEXT.dark)}
        offText={t(THEME_SWITCHER_TEXT.light)}
        value={isThemeDark}
        onChange={toggleTheme}
      />
    </div>
  )
}
