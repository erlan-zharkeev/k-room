import './style.scss'
import { AppForm } from 'src/shared/ui'
import { usePasswordRecovery } from '../../hooks'

export const PasswordRecoveryForm = () => {
  const { codeSent } = usePasswordRecovery()

  return (
    <div className="password-recovery-form">
      <AppForm
        onSubmit={() => {}}
        fields={{
          email: {
            value: '',
            placeholder: 'Enter your email',
            rule: { name: 'email' }
          }
        }}
        submitBtnText="Send code"
        submitBtnLoading={false}
      />
      {codeSent && (
        <AppForm
          onSubmit={() => {}}
          fields={{
            code: {
              value: '',
              placeholder: 'Enter code from email'
            }
          }}
          submitBtnText="Validate"
          submitBtnLoading={false}
        />
      )}
    </div>
  )
}
