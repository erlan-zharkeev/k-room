import './style.scss'
import { ROUTE_NAMES } from 'common'

import { LOGIN_FORM_I18N, LoginFormProps } from 'src/features/auth'

import { useI18n } from 'src/entities/settings'

import { AppButton, AppForm, AppLink } from 'src/shared/ui'

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
            placeholder: t(LOGIN_FORM_I18N.emailPlaceholder),
            rule: { name: 'email' }
          },
          password: {
            value: '',
            inputType: 'text',
            nativeType: 'password',
            placeholder: t(LOGIN_FORM_I18N.passwordPlaceholder),
            rule: { name: 'required' }
          }
        }}
        submitBtnText={t(LOGIN_FORM_I18N.submit)}
        actionProcessing={isLoading}
        disabled={isFirebaseLoginLoading}
      >
        <div className="login-form__additional__links">
          <AppButton
            prefixIconName="google"
            iconSize="xs"
            text={t(LOGIN_FORM_I18N.withGoogle)}
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
              to={ROUTE_NAMES.passwordRecovery}
              text={t(LOGIN_FORM_I18N.forgotPassword)}
              disabled={isLoading || isFirebaseLoginLoading}
            />
          </div>
        </div>
      </AppForm>
    </div>
  )
}
