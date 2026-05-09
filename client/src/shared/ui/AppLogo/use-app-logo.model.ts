import { ROUTE_NAMES } from 'global-shared'

import { APP_LOGO_DEFAULT_SRC } from './constants'

export const useAppLogo = () => ({
  appName: __CLIENT_ENV_DATA__.appName,
  defaultSrc: APP_LOGO_DEFAULT_SRC,
  to: ROUTE_NAMES.app
})
