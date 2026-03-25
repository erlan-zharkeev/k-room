import './style.scss'

import { PASSWORD_RECOVERY_PAGE_TEXT } from 'src/pages/password-recovery/ui/PasswordRecovery/config'

import { PasswordRecoveryBody } from 'src/features/auth'

import { useI18n } from 'src/entities/system'

export const PasswordRecovery = () => {
  const { t } = useI18n()

  return (
    <div className="password-recovery">
      <h2 className="password-recovery__title header-text header-text--md header-text--accent">
        {t(PASSWORD_RECOVERY_PAGE_TEXT.title)}
      </h2>
      <PasswordRecoveryBody />
    </div>
  )
}
