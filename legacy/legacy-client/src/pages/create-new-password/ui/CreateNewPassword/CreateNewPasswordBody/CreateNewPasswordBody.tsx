import './create-new-password-body.scss'

import { useNavigate } from 'react-router-dom'

import { ROUTE_NAMES } from 'common'

import { useI18n } from 'src/shared/preferences'
import { AppBanner, AppButton, AppForm } from 'src/shared/ui'

import { useCreateNewPassword } from '../../../model/use-create-new-password'
import { CREATE_NEW_PASSWORD_BODY_I18N } from './internals/i18n'

export const CreateNewPasswordBody = () => {
  const { onSubmit, isLoading, passMatched, checkPassMatch, isFormTouched, isPasswordChanged } = useCreateNewPassword()
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <div className="create-new-password-body">
      {isPasswordChanged ? (
        <div className="create-new-password-body__success">
          <AppBanner message={t(CREATE_NEW_PASSWORD_BODY_I18N.success)} type="success" />
          <div className="create-new-password-body__to-login-btn">
            <AppButton
              onClick={() => navigate(ROUTE_NAMES.login)}
              text={t(CREATE_NEW_PASSWORD_BODY_I18N.toLogin)}
              color="success-color"
              hoverless
            />
          </div>
        </div>
      ) : (
        <AppForm
          title={t(CREATE_NEW_PASSWORD_BODY_I18N.title)}
          disabled={!passMatched}
          onSubmit={onSubmit}
          onChange={checkPassMatch}
          fields={{
            firstPassword: {
              value: '',
              inputType: 'text',
              placeholder: t(CREATE_NEW_PASSWORD_BODY_I18N.firstPasswordPlaceholder),
              rule: { name: 'password' },
              autoComplete: 'off',
              type: 'password'
            },
            secondPassword: {
              value: '',
              inputType: 'text',
              placeholder: t(CREATE_NEW_PASSWORD_BODY_I18N.secondPasswordPlaceholder),
              rule: { name: 'password' },
              autoComplete: 'off',
              type: 'password'
            }
          }}
          submitBtnText={t(CREATE_NEW_PASSWORD_BODY_I18N.submit)}
          actionProcessing={isLoading}
        >
          {!passMatched && isFormTouched && (
            <div className="create-new-password-body__additional-error paragraph-text paragraph-text--error">
              {t(CREATE_NEW_PASSWORD_BODY_I18N.mismatch)}
            </div>
          )}
        </AppForm>
      )}
    </div>
  )
}
