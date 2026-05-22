import { Theme } from 'src/shared/config'
import { setThemeToDom, useSettings } from 'src/shared/preferences'

export const useThemeUpdate = () => {
  const settings = useSettings()

  const updateThemeByName = (value: Theme) => {
    settings.shallowUpdate({ theme: value })
    setThemeToDom(value)
  }

  const toggleTheme = (value: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = value.target
    const newTheme = checked ? 'dark' : 'light'
    updateThemeByName(newTheme)
  }

  return {
    toggleTheme,
    updateThemeByName,
    setThemeToDom
  }
}
