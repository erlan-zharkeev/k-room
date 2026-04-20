import './style.scss'
import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { REQ_STATUS, ROUTE_NAMES, AUTH_ENDPOINTS, IConfirmEmailResponse } from 'common'

import { EMAIL_CONFIRMATION_I18N } from 'src/pages/email-confirmation'

import { useLogout } from 'src/features/logout'

import { useApi } from 'src/shared/api'
import { useQuery } from 'src/shared/lib'
import { useI18n } from 'src/shared/preferences'
import { AppIcon, AppButton, AppText } from 'src/shared/ui'

export const EmailConfirmation = () => {
  const navigate = useNavigate()
  const query = useQuery()
  const { logout } = useLogout()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { doRequest } = useApi()

  const sendEmailConfirmation = async (token: string) => {
    try {
      const response = await doRequest<IConfirmEmailResponse>('post', AUTH_ENDPOINTS.confirmEmail, { token })
      if (response?.status !== REQ_STATUS.success) return navigate(ROUTE_NAMES.login)
      const payload = response.data.payload
      setEmail(payload.email)
      await logout()
    } catch {
      navigate(ROUTE_NAMES.login)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = query.value.get('token')
    if (token) sendEmailConfirmation(token)
    else navigate(ROUTE_NAMES.login)
  }, [])

  return (
    <div className="email-confirmation">
      <div className="email-confirmation__wrapper">
        <div className="email-confirmation__header">{t(EMAIL_CONFIRMATION_I18N.title)}</div>
        {isLoading ? (
          <div className="email-confirmation__loader">
            <AppIcon color="accent-color" size="large" name="loader" />
          </div>
        ) : (
          <>
            <div className="paragraph-text">
              {t(EMAIL_CONFIRMATION_I18N.email)}
              <AppText tag="span" size="large" additionalClassName="email-confirmation__email">
                {' '}
                {email}{' '}
              </AppText>
              {t(EMAIL_CONFIRMATION_I18N.confirmed)}
            </div>
            <AppButton text={t(EMAIL_CONFIRMATION_I18N.back)} onClick={() => navigate(ROUTE_NAMES.login)} />
          </>
        )}
      </div>
    </div>
  )
}
