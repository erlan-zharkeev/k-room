import { Theme } from 'common-types'

export const setTheme = (theme: Theme) => {
  const html = document.querySelector('html')
  html?.setAttribute('theme', theme)
}
