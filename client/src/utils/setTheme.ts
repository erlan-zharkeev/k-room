import { theme } from '../store/@types/SystemState'

const setTheme = (theme: theme) => {
  const html = document.querySelector('html')
  html?.setAttribute('theme', theme)
}

export default setTheme
