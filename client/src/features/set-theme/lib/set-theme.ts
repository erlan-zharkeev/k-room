import { ThemeType } from 'common-types'

export const setTheme = (theme: ThemeType) => {
  const html = document.querySelector('html')
  html?.setAttribute('theme', theme)
}
