import './style.scss'
import { useState, useEffect } from 'react'

import { StatusEnum, RouteNamesEnum, AuthEndpointsEnum, IConfirmEmailResponse } from 'common'
import { useNavigate } from 'react-router-dom'

import { EMAIL_CONFIRMATION_TEXT } from 'src/pages/email-confirmation/ui/EmailConfirmation/config'

import { useLogout } from 'src/features/auth'

import { useI18n } from 'src/entities/system'

import { useApi } from 'src/shared/api'
import { useQuery } from 'src/shared/lib'
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
    const response = await doRequest<IConfirmEmailResponse>('post', AuthEndpointsEnum.ConfirmEmail, { token })
    if (response?.status !== StatusEnum.Success) return navigate(RouteNamesEnum.Login)
    const payload = response.data.payload
    setEmail(payload.email)
    await logout()
    setIsLoading(false)
  }

  useEffect(() => {
    const token = query.value.get('token')
    if (token) sendEmailConfirmation(token)
    else navigate(RouteNamesEnum.Login)
  }, [])

  return (
    <div className="email-confirmation">
      <div className="email-confirmation__wrapper">
        <div className="email-confirmation__header">{t(EMAIL_CONFIRMATION_TEXT.title)}</div>
        {isLoading ? (
          <div className="email-confirmation__loader">
            <AppIcon color="accent-color" size="large" name="loader" />
          </div>
        ) : (
          <>
            <div className="paragraph-text">
              {t(EMAIL_CONFIRMATION_TEXT.email)}
              <AppText tag="span" size="large" additionalClassName="email-confirmation__email">
                {' '}{email}{' '}
              </AppText>
              {t(EMAIL_CONFIRMATION_TEXT.confirmed)}
            </div>
            <AppButton text={t(EMAIL_CONFIRMATION_TEXT.back)} onClick={() => navigate(RouteNamesEnum.Login)} />
          </>
        )}
      </div>
    </div>
  )
}
