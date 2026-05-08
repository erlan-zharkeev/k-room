import { APP_LANGUAGE } from 'global-shared'

const BROWSER_LANGUAGE = navigator.language.toLowerCase()

export const CLIENT_LANGUAGE = BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Ru)
  ? APP_LANGUAGE.Ru
  : BROWSER_LANGUAGE.startsWith(APP_LANGUAGE.Zh)
  ? APP_LANGUAGE.Zh
  : APP_LANGUAGE.En
