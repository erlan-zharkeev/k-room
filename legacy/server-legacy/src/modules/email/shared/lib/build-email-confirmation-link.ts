import { ROUTE_NAMES } from 'common'

import { SERVER_ENV } from 'src/shared/config'

export const buildEmailConfirmationLink = (token: string) => {
  const confirmUrl = new URL(ROUTE_NAMES.emailConfirmation, SERVER_ENV.clientUrl)
  confirmUrl.searchParams.set('token', token)

  return confirmUrl.toString()
}
