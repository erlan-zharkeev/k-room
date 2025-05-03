import './style.scss'
import { RouteNamesEnum } from 'common-types'
import { useNavigate } from 'react-router-dom'

import { AppButton, AppForm, AppBanner } from 'src/shared/ui'

import { useCreateNewPassword } from '../../hooks'
export const CreateNewPasswordBody = () => {
  const { onSubmit, isLoading, passMatched, checkPassMatch, isFormTouched, isPasswordChanged } = useCreateNewPassword()
  const navigate = useNavigate()

  return (
    <div className="create-new-password-body">
      {isPasswordChanged ? (
        <div className="create-new-password-body__success">
          <AppBanner message="Password changed successfully!" type="success" />
          <div className="create-new-password-body__to-login-btn">
            <AppButton
              onClick={() => navigate(RouteNamesEnum.Login)}
              text="Go to login page"
              color="success-color"
              hoverless
            />
          </div>
        </div>
      ) : (
        <AppForm
          title="Create new password"
          disabled={!passMatched}
          onSubmit={onSubmit}
          onChange={checkPassMatch}
          fields={{
            firstPassword: {
              value: '',
              inputType: 'text',
              placeholder: 'Password',
              rule: { name: 'password' },
              autoComplete: 'off',
              type: 'password'
            },
            secondPassword: {
              value: '',
              inputType: 'text',
              placeholder: 'Confirm password',
              rule: { name: 'password' },
              autoComplete: 'off',
              type: 'password'
            }
          }}
          submitBtnText="Change password"
          submitBtnLoading={isLoading}
        >
          {!passMatched && isFormTouched && (
            <div className="create-new-password-body__additional-error paragraph-text paragraph-text--error">
              Password don`t match
            </div>
          )}
        </AppForm>
      )}
    </div>
  )
}
