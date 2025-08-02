import './style.scss'
import { RouteNamesEnum } from 'common-types'

import { AppButton, AppForm, AppLink } from 'src/shared/ui'

import { LoginFormProps } from './types'

export const LoginForm = ({ onLogin, isLoading, onFirebaseLogin, isFirebaseLoginLoading }: LoginFormProps) => {
  return (
    <div className="login-form">
      <AppForm
        onSubmit={onLogin}
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
        actionProcessing={isLoading}
        disabled={isFirebaseLoginLoading}
      >
        <div className="login-form__additional__links">
          <AppButton
            prefixIconName="google"
            iconSize="xs"
            text="Login with Google"
            onClick={() => {
              onFirebaseLogin('google')
            }}
            loading={isFirebaseLoginLoading}
            hoverless
            disabled={isLoading}
            fill
          />
          <div className="login-form__forgot-password">
            <AppLink
              href={RouteNamesEnum.PasswordRecovery}
              text="Forgot password?"
              disabled={isLoading || isFirebaseLoginLoading}
            />
          </div>
        </div>
      </AppForm>
    </div>
  )
}
