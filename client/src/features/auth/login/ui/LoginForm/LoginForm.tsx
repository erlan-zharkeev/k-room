import './style.scss'
import { RouteNamesEnum } from 'common'

import { useI18n } from 'src/entities/system'

import { AppButton, AppForm, AppLink } from 'src/shared/ui'

import { LOGIN_FORM_TEXT } from './config'
import { LoginFormProps } from './types'

export const LoginForm = ({ onLogin, isLoading, onFirebaseLogin, isFirebaseLoginLoading }: LoginFormProps) => {
  const { t } = useI18n()

  return (
    <div className="login-form">
      <AppForm
        onSubmit={onLogin}
        fields={{
          email: {
            value: '',
            inputType: 'text',
            nativeType: 'email',
            placeholder: t(LOGIN_FORM_TEXT.emailPlaceholder),
            rule: { name: 'email' }
          },
          password: {
            value: '',
            inputType: 'text',
            nativeType: 'password',
            placeholder: t(LOGIN_FORM_TEXT.passwordPlaceholder),
            rule: { name: 'password' }
          }
        }}
        submitBtnText={t(LOGIN_FORM_TEXT.submit)}
        actionProcessing={isLoading}
        disabled={isFirebaseLoginLoading}
      >
        <div className="login-form__additional__links">
          <AppButton
            prefixIconName="google"
            iconSize="xs"
            text={t(LOGIN_FORM_TEXT.withGoogle)}
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
              to={RouteNamesEnum.PasswordRecovery}
              text={t(LOGIN_FORM_TEXT.forgotPassword)}
              disabled={isLoading || isFirebaseLoginLoading}
            />
          </div>
        </div>
      </AppForm>
    </div>
  )
}
