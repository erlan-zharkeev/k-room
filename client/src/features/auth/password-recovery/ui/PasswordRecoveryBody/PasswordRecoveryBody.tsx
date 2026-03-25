import './style.scss'
import { usePasswordRecovery } from 'src/features/auth/password-recovery/hooks'

import { useI18n } from 'src/entities/system'

import { AppButton, AppForm } from 'src/shared/ui'

import { PASSWORD_RECOVERY_BODY_TEXT } from './config'

export const PasswordRecoveryBody = () => {
  const { t } = useI18n()
  const {
    codeSent,
    email,
    hasPresetEmail,
    emailSendCodeIsLoading,
    codeValidationIsLoading,
    counterValue,
    sendEmailCodeToPasswordRecovery,
    validateCodeToRecoveryPassword
  } = usePasswordRecovery()

  return (
    <div className="password-recovery-body">
      {hasPresetEmail ? (
        <div className="password-recovery-body__email paragraph-text paragraph-text--md">{email}</div>
      ) : (
        <AppForm
          onSubmit={(formData) => {
            void sendEmailCodeToPasswordRecovery(formData)
          }}
          fields={{
            email: {
              inputType: 'text',
              value: email,
              nativeType: 'email',
              placeholder: t(PASSWORD_RECOVERY_BODY_TEXT.emailPlaceholder),
              rule: { name: 'email' }
            }
          }}
          submitBtnText={t(PASSWORD_RECOVERY_BODY_TEXT.sendCode)}
          actionProcessing={emailSendCodeIsLoading}
          disabledActionBtn={counterValue > 0}
        />
      )}
      {counterValue > 0 && (
        <div className="paragraph-text password-recovery-body__new-code-warning">
          {t(PASSWORD_RECOVERY_BODY_TEXT.resendTimer)(counterValue)}
        </div>
      )}
      {hasPresetEmail && (
        <div className="password-recovery-body__send-code-btn">
          <AppButton
            text={t(PASSWORD_RECOVERY_BODY_TEXT.sendCode)}
            color="accent-color"
            loading={emailSendCodeIsLoading}
            disabled={counterValue > 0}
            onClick={() => {
              void sendEmailCodeToPasswordRecovery()
            }}
          />
        </div>
      )}
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
