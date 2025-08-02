import { useSettings } from 'src/entities/settings'

import { AppSwitch, AppText } from 'src/shared/ui'

import { useThemeUpdate } from '../../hooks'

export const ThemeSwitcher = () => {
  const { toggleTheme } = useThemeUpdate()
  const { isThemeDark } = useSettings()

  return (
    <div className="theme-switcher">
      <AppText size="small">Theme</AppText>
      <AppSwitch name="theme" onText="Dark" offText="Light" value={isThemeDark} onChange={toggleTheme} />
    </div>
  )
}
