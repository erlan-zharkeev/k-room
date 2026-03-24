import './style.scss'
import type { IAuthRegistrationPayload } from 'common-types'

import { AppForm } from 'src/shared/ui'

import { PrivacyPolicySwitch } from '../PrivacyPolicySwitch/PrivacyPolicySwitch'

import { RegistrationFormProps } from './types'

type RegistrationFormData = IAuthRegistrationPayload & {
  policy: boolean
}

export const RegistrationForm = ({ onRegister, isLoading }: RegistrationFormProps) => {
  return (
    <div className="registration-form">
      <AppForm<RegistrationFormData>
        onSubmit={onRegister}
        fields={{
          username: {
            inputType: 'text',
            value: '',
            placeholder: 'Username',
            rule: { name: 'minLength', quantity: 2 },
            autoComplete: 'on'
          },
          email: {
            inputType: 'text',
            nativeType: 'email',
            value: '',
            placeholder: 'Email',
            rule: { name: 'email' },
            autoComplete: 'on'
          },
          password: {
            inputType: 'text',
            value: '',
            placeholder: 'Password',
            rule: { name: 'minLength', quantity: 6 },
            autoComplete: 'off',
            nativeType: 'password'
          },
          policy: {
            inputType: 'switch',
            value: false,
            rule: { name: 'requiredTrue' },
            children: <PrivacyPolicySwitch disabled={isLoading} />,
            onText: 'Read',
            offText: 'Unread'
          }
        }}
        submitBtnText="Register"
        actionProcessing={isLoading}
      />
    </div>
  )
}
