import { useSettings } from 'src/entities/settings'

import { AppSwitch } from 'src/shared/ui'

import { useThemeUpdate } from '../../hooks'

export const ThemeSwitcher = () => {
  const { toggleTheme } = useThemeUpdate()
  const { isThemeDark } = useSettings()

  return (
    <div className="theme-switcher">
      <div className="paragraph-text paragraph-text--center">Theme</div>
      <AppSwitch name="theme" onText="Dark" offText="Light" value={isThemeDark} onChange={toggleTheme} />
    </div>
  )
}
