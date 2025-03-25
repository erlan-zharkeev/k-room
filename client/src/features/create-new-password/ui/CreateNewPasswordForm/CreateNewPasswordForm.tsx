import './style.scss'
import { AppForm } from 'src/shared/ui'
import { useCreateNewPassword } from '../../hooks'

export const CreateNewPasswordForm = () => {
  const { onSubmit, isLoading, passMatched } = useCreateNewPassword()

  return (
    <>
      <AppForm
        onSubmit={onSubmit}
        fields={{
          firstPassword: {
            value: '',
            placeholder: 'Password',
            rule: { name: 'minLength', quantity: 6 },
            autoComplete: 'off',
            type: 'password'
          },
          secondPassword: {
            value: '',
            placeholder: 'Confirm password',
            rule: { name: 'minLength', quantity: 6 },
            autoComplete: 'off',
            type: 'password'
          }
        }}
        submitBtnText="Change password"
        submitBtnLoading={isLoading}
      />
      {!passMatched && <div>Password don`t match</div>}
    </>
  )
}
