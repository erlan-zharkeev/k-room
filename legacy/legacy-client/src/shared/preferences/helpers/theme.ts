import { Theme } from 'src/shared/config'

export const setThemeToDom = (theme: Theme) => {
  const html = document.querySelector('html')
  html?.setAttribute('theme', theme)
}
