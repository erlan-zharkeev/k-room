import './style.scss'
import { RouteNamesEnum } from 'common-types'

import { AppButton, AppForm, AppLink } from 'src/shared/ui'

import { useFirebase, useLogin } from '../../hooks'

export const LoginForm = () => {
  const { onSubmit, isLoading } = useLogin()
  const { firebaseLoginLoading, firebaseLogin } = useFirebase()

  return (
    <div className="login-form">
      <AppForm
        onSubmit={onSubmit}
        fields={{
          email: {
            value: '',
            inputType: 'text',
            nativeType: 'email',
            placeholder: 'Enter your email',
            rule: { name: 'email' }
          },
          password: {
            value: '',
            inputType: 'text',
            nativeType: 'password',
            placeholder: 'Enter your password',
            rule: { name: 'password' }
          }
        }}
        submitBtnText="Login"
        submitBtnLoading={isLoading}
        disabled={firebaseLoginLoading}
      >
        <div className="login-form__additional__links">
          <AppButton
            prefixIconName="google"
            iconSize="xs"
            text="Sign in with Google"
            onClick={() => {
              firebaseLogin('google')
            }}
            loading={firebaseLoginLoading}
            hoverless
            disabled={isLoading}
          />
          <div className="login-form__forgot-password">
            <AppLink
              href={RouteNamesEnum.PasswordRecovery}
              text="Forgot password?"
              disabled={isLoading || firebaseLoginLoading}
            />
          </div>
        </div>
      </AppForm>
    </div>
  )
}
