import { ThemeType } from 'common-types'
import { useDispatch } from 'react-redux'

import { changeTheme } from 'src/entities/settings'

import { saveUserSetting } from '../../save-setting'

export const useThemeUpdate = () => {
  const dispatch = useDispatch()

  const setTheme = (value: ThemeType) => {
    const html = document.querySelector('html')
    html?.setAttribute('theme', value)
  }

  const updateThemeByName = (value: ThemeType) => {
    dispatch(changeTheme(value))
    saveUserSetting({ type: 'theme', value })
    setTheme(value)
  }

  const toggleTheme = (value: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = value.target
    const newTheme = checked ? 'dark' : 'light'
    updateThemeByName(newTheme)
  }

  return {
    toggleTheme,
    updateThemeByName,
    setTheme
  }
}
