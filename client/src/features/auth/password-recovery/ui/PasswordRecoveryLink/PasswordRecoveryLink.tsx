import { RouteNamesEnum } from 'common'

import './style.scss'

import { useI18n } from 'src/entities/system'
import { useUser } from 'src/entities/user'

import { AppLink } from 'src/shared/ui'

import { PASSWORD_RECOVERY_LINK_I18N } from '../..'

export const PasswordRecoveryLink = () => {
  const { email } = useUser()
  const { t } = useI18n()

  return (
    <AppLink
      text={t(PASSWORD_RECOVERY_LINK_I18N.link)}
      to={{ pathname: RouteNamesEnum.PasswordRecovery, search: `?user-email=${email}` }}
    />
  )
}
