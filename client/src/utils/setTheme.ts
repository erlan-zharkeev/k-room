import { theme } from 'common-types'

const setTheme = (theme: theme) => {
  const html = document.querySelector('html')
  html?.setAttribute('theme', theme)
}

export default setTheme
