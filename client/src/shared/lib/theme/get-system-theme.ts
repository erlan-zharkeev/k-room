export const getSystemTheme = () => (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark')

export const isSystemThemeLight = () => getSystemTheme() === 'light'
