import './style.scss'
import { usePasswordRecovery } from 'src/features/auth/password-recovery/hooks'
import { PASSWORD_RECOVERY_BODY_TEXT } from 'src/features/auth/password-recovery/ui/PasswordRecoveryBody/config'

import { useI18n } from 'src/entities/system'

import { AppButton, AppForm } from 'src/shared/ui'

export const PasswordRecoveryBody = () => {
  const { t } = useI18n()
  const {
    codeSent,
    email,
    emailSendCodeIsLoading,
    codeValidationIsLoading,
    counterValue,
    sendEmailCodeToPasswordRecovery,
    validateCodeToRecoveryPassword
  } = usePasswordRecovery()

  return (
    <div className="password-recovery-body">
      <div className="password-recovery-body__email paragraph-text paragraph-text--md">{email}</div>
      {counterValue > 0 && (
        <div className="paragraph-text password-recovery-body__new-code-warning">
          {t(PASSWORD_RECOVERY_BODY_TEXT.resendTimer)(counterValue)}
        </div>
      )}
      <div className="password-recovery-body__send-code-btn">
        <AppButton
          text={t(PASSWORD_RECOVERY_BODY_TEXT.sendCode)}
          color="accent-color"
          loading={emailSendCodeIsLoading}
          disabled={counterValue > 0}
          onClick={sendEmailCodeToPasswordRecovery}
        />
      </div>
      {codeSent && (
        <AppForm
          onSubmit={validateCodeToRecoveryPassword}
          fields={{
            code: {
              inputType: 'text',
              value: '',
              placeholder: t(PASSWORD_RECOVERY_BODY_TEXT.codePlaceholder),
              rule: { name: 'minLength', quantity: 1 }
            }
          }}
          submitBtnText={t(PASSWORD_RECOVERY_BODY_TEXT.validate)}
          actionProcessing={codeValidationIsLoading}
        />
      )}
    </div>
  )
}
