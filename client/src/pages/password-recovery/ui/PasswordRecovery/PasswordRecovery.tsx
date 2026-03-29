import './style.scss'

import { PasswordRecoveryBody } from 'src/features/auth'

import { useI18n } from 'src/entities/system'

import { AppHeader } from 'src/shared/ui'

import { PASSWORD_RECOVERY_PAGE_I18N } from '../../config'

export const PasswordRecovery = () => {
  const { t } = useI18n()

  return (
    <div className="password-recovery">
      <AppHeader tag="h2" accent additionalClassName="password-recovery__title">
        {t(PASSWORD_RECOVERY_PAGE_I18N.title)}
      </AppHeader>
      <PasswordRecoveryBody />
    </div>
  )
}
