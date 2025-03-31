import './style.scss'
import { useLogin } from '../../hooks'
import { RouteNamesEnum } from 'common-types'
import { AppButton } from 'src/shared/ui'
import { AppForm } from 'src/shared/ui/AppForm/AppForm'

export const LoginForm = () => {
  const { onSubmit, isLoading, googleBtnLoading, providerLogin } = useLogin()

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
          <AppButton
            prefixIconName="google"
            iconSize="xs"
            text="Sign in with Google"
            onClick={() => providerLogin('google')}
            loading={googleBtnLoading}
            hoverless
          />
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
