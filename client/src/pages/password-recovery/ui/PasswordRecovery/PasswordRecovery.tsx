import './style.scss'

import { PASSWORD_RECOVERY_PAGE_TEXT } from 'src/pages/password-recovery/ui/PasswordRecovery/config'

import { PasswordRecoveryBody } from 'src/features/auth'

import { useI18n } from 'src/entities/system'

import { AppHeader } from 'src/shared/ui'

export const PasswordRecovery = () => {
  const { t } = useI18n()

  return (
    <div className="password-recovery">
      <AppHeader tag="h2" accent additionalClassName="password-recovery__title">
        {t(PASSWORD_RECOVERY_PAGE_TEXT.title)}
      </AppHeader>
      <PasswordRecoveryBody />
    </div>
  )
}
