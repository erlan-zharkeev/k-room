import { RouteNamesEnum } from 'common'

import { ENV } from 'src/shared/config'

export const buildEmailConfirmationLink = (token: string) => {
  const confirmUrl = new URL(RouteNamesEnum.EmailConfirmation, ENV.CLIENT_URL)
  confirmUrl.searchParams.set('token', token)

  return confirmUrl.toString()
}
