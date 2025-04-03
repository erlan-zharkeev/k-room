import './style.scss'
import { RouteNamesEnum } from 'common-types'

import { AppForm } from 'src/shared/ui'

import { useLogin } from '../../hooks'
import { FirebaseProviderLoginBtn } from '../FirebaseProviderLoginBtn/FirebaseProviderLoginBtn'

export const LoginForm = () => {
  const { onSubmit, isLoading } = useLogin()

  return (
    <div className="login-form">
      <AppForm
        onSubmit={onSubmit}
        fields={{
          email: {
            value: '',
            placeholder: 'Enter your email',
            rule: { name: 'email' }
          },
          password: {
            value: '',
            placeholder: 'Enter your password',
            type: 'password',
            rule: { name: 'password' }
          }
        }}
        submitBtnText="Login"
        submitBtnLoading={isLoading}
      >
        <div className="login-form__additional__links">
          <FirebaseProviderLoginBtn />
          <div className="login-form__forgot-password">
            <a className="link link--small" href={RouteNamesEnum.PasswordRecovery}>
              Forgot password?
            </a>
          </div>
        </div>
      </AppForm>
    </div>
  )
}
