import { ROUTE_NAMES } from 'global-shared'

import { CLIENT_ENV } from 'src/shared/config'

import { APP_LOGO_DEFAULT_SRC } from './constants'

export const useAppLogo = () => ({
  appName: CLIENT_ENV.appName,
  defaultSrc: APP_LOGO_DEFAULT_SRC,
  to: ROUTE_NAMES.app
})
