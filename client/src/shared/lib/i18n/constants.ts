const BROWSER_LANGUAGE = navigator.language.toLowerCase()

export const CLIENT_LANGUAGE = BROWSER_LANGUAGE.startsWith('ru')
  ? 'ru'
  : BROWSER_LANGUAGE.startsWith('zh')
  ? 'zh'
  : 'en'
