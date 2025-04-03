import { useDispatch } from 'react-redux'

import { changeTheme, useSettings } from 'src/entities/settings'

export const useThemeUpdate = () => {
  const { theme, updateSetting } = useSettings()
  const dispatch = useDispatch()

  const setTheme = () => {
    const html = document.querySelector('html')
    html?.setAttribute('theme', theme)
  }

  const updateTheme = (value: boolean) => {
    const newTheme = value ? 'dark' : 'light'
    dispatch(changeTheme(newTheme))
    setTheme()
    updateSetting('theme', { theme: newTheme })
  }

  return {
    setTheme,
    updateTheme
  }
}
