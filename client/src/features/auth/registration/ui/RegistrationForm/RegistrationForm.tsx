import './style.scss'
import type { IAuthRegistrationPayload } from 'common'

import { useI18n } from 'src/entities/system'

import { AppForm } from 'src/shared/ui'

import { PrivacyPolicySwitch, REGISTRATION_FORM_I18N, RegistrationFormProps } from '../..'

type RegistrationFormData = IAuthRegistrationPayload & {
  policy: boolean
}

export const RegistrationForm = ({ onRegister, isLoading }: RegistrationFormProps) => {
  const { t } = useI18n()

  return (
    <div className="registration-form">
      <AppForm<RegistrationFormData>
        onSubmit={onRegister}
        fields={{
            username: {
              inputType: 'text',
              value: '',
              placeholder: t(REGISTRATION_FORM_I18N.usernamePlaceholder),
              rule: { name: 'minLength', quantity: 2 },
              autoComplete: 'on'
            },
          email: {
              inputType: 'text',
              nativeType: 'email',
              value: '',
              placeholder: t(REGISTRATION_FORM_I18N.emailPlaceholder),
              rule: { name: 'email' },
              autoComplete: 'on'
            },
          password: {
              inputType: 'text',
              value: '',
              placeholder: t(REGISTRATION_FORM_I18N.passwordPlaceholder),
              rule: { name: 'minLength', quantity: 6 },
              autoComplete: 'off',
              nativeType: 'password'
          },
          policy: {
            inputType: 'switch',
            value: false,
            rule: { name: 'requiredTrue' },
            children: <PrivacyPolicySwitch disabled={isLoading} />,
            onText: t(REGISTRATION_FORM_I18N.read),
            offText: t(REGISTRATION_FORM_I18N.unread)
          }
        }}
        submitBtnText={t(REGISTRATION_FORM_I18N.submit)}
        actionProcessing={isLoading}
      />
    </div>
  )
}
