import './style.scss'
import { AuthRegistrationPayloadType } from 'common-types'

import { AppForm } from 'src/shared/ui'

import { useRegistration } from '../../hooks'
import { PrivacyPolicySwitch } from '../PrivacyPolicySwitch/PrivacyPolicySwitch'

export const RegistrationForm = () => {
  const { register, isLoading } = useRegistration()

  const onSubmit = (payload: unknown) => {
    const formData = payload as AuthRegistrationPayloadType
    register(formData)
  }

  return (
    <div className="registration-form">
      <AppForm
        onSubmit={onSubmit}
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
        submitBtnLoading={isLoading}
      />
    </div>
  )
}
