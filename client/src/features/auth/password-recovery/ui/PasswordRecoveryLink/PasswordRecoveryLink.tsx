import { ROUTE_NAMES } from 'common'

import './style.scss'

import { PASSWORD_RECOVERY_LINK_I18N } from 'src/features/auth'

import { useUser } from 'src/entities/user'

import { useI18n } from 'src/shared/settings'
import { AppLink } from 'src/shared/ui'

export const PasswordRecoveryLink = () => {
  const { email } = useUser()
  const { t } = useI18n()

  return (
    <AppLink
      text={t(PASSWORD_RECOVERY_LINK_I18N.link)}
      to={{ pathname: ROUTE_NAMES.passwordRecovery, search: `?user-email=${email}` }}
    />
  )
}
