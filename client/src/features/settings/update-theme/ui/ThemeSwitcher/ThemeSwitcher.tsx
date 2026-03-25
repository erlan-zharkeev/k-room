
import { useSettings } from 'src/entities/settings'
import { useI18n } from 'src/entities/system'

import { AppSwitch, AppText } from 'src/shared/ui'

import { useThemeUpdate } from '../../hooks'

import { THEME_SWITCHER_TEXT } from './config'

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
