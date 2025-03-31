import './style.scss'
import { AppForm } from 'src/shared/ui'
import { PrivacyPolicySwitch } from '../PrivacyPolicySwitch/PrivacyPolicySwitch'
import { useRegistration } from '../../hooks'
import { AuthRegistrationPayloadType } from 'common-types'

export const RegistrationForm = () => {
  const { register } = useRegistration()

  const onSubmit = (paylod: unknown) => {
    const formData = paylod as AuthRegistrationPayloadType
    register(formData)
  }

  return (
    <div className="registration-form">
      <AppForm
        onSubmit={onSubmit}
        fields={{
          username: {
            value: '',
            placeholder: 'Username',
            rule: { name: 'minLength', quantity: 2 },
            autoComplete: 'on'
          },
          email: {
            value: '',
            placeholder: 'Email',
            rule: { name: 'email' },
            autoComplete: 'on'
          },
          password: {
            value: '',
            placeholder: 'Password',
            rule: { name: 'minLength', quantity: 6 },
            autoComplete: 'off',
            type: 'password'
          },
          policy: {
            inputType: 'switch',
            value: false,
            rule: { name: 'requiredTrue' },
            children: <PrivacyPolicySwitch />,
            onText: 'Read',
            offText: 'Unread'
          }
        }}
        submitBtnText="Register"
        submitBtnLoading={false}
      />
    </div>
  )
}
