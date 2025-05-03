import './style.scss'
import { AppButton, AppForm } from 'src/shared/ui'

import { usePasswordRecovery } from '../../hooks'

export const PasswordRecoveryBody = () => {
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
          A new code can be sent after {counterValue} seconds.
        </div>
      )}
      <div className="password-recovery-body__send-code-btn">
        <AppButton
          text="Send code"
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
              placeholder: 'Enter code from email',
              rule: { name: 'minLength', quantity: 1 }
            }
          }}
          submitBtnText="Validate"
          submitBtnLoading={codeValidationIsLoading}
        />
      )}
    </div>
  )
}
