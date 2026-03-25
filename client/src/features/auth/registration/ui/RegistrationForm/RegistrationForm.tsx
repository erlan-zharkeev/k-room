import './style.scss'
import type { IAuthRegistrationPayload } from 'common-types'

import { PrivacyPolicySwitch } from 'src/features/auth/registration/ui/PrivacyPolicySwitch/PrivacyPolicySwitch'
import { REGISTRATION_FORM_TEXT } from 'src/features/auth/registration/ui/RegistrationForm/config'
import { RegistrationFormProps } from 'src/features/auth/registration/ui/RegistrationForm/types'

import { useI18n } from 'src/entities/system'

import { AppForm } from 'src/shared/ui'

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
              placeholder: t(REGISTRATION_FORM_TEXT.usernamePlaceholder),
              rule: { name: 'minLength', quantity: 2 },
              autoComplete: 'on'
            },
          email: {
              inputType: 'text',
              nativeType: 'email',
              value: '',
              placeholder: t(REGISTRATION_FORM_TEXT.emailPlaceholder),
              rule: { name: 'email' },
              autoComplete: 'on'
            },
          password: {
              inputType: 'text',
              value: '',
              placeholder: t(REGISTRATION_FORM_TEXT.passwordPlaceholder),
              rule: { name: 'minLength', quantity: 6 },
              autoComplete: 'off',
              nativeType: 'password'
          },
          policy: {
            inputType: 'switch',
            value: false,
            rule: { name: 'requiredTrue' },
            children: <PrivacyPolicySwitch disabled={isLoading} />,
            onText: t(REGISTRATION_FORM_TEXT.read),
            offText: t(REGISTRATION_FORM_TEXT.unread)
          }
        }}
        submitBtnText={t(REGISTRATION_FORM_TEXT.submit)}
        actionProcessing={isLoading}
      />
    </div>
  )
}
