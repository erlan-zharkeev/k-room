import type { ThemeType } from 'src/shared/config'

export const setThemeToDom = (theme: ThemeType) => {
  const html = document.querySelector('html')
  html?.setAttribute('theme', theme)
}
