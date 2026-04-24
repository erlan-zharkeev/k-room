import './style.scss'

import { PASSWORD_RECOVERY_PAGE_I18N } from 'src/pages/password-recovery/ui/PasswordRecovery/internals/i18n'

import { PasswordRecoveryBody } from 'src/features/password-recovery'

import { useI18n } from 'src/shared/preferences'
import { AppHeader } from 'src/shared/ui'

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
