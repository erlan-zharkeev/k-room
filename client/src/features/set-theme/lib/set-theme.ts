import { ThemeType } from 'common-types'

export const setThemeToDom = (theme: ThemeType) => {
  const html = document.querySelector('html')
  html?.setAttribute('theme', theme)
}
