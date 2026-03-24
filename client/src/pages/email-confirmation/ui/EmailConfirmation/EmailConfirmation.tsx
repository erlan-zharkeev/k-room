import './style.scss'
import { useState, useEffect } from 'react'

import { StatusEnum, RouteNamesEnum, AuthEndpointsEnum, IConfirmEmailResponse } from 'common-types'
import { useNavigate } from 'react-router-dom'

import { useLogout } from 'src/features/auth'

import { useApi } from 'src/shared/api'
import { useQuery } from 'src/shared/lib'
import { AppIcon, AppButton } from 'src/shared/ui'

export const EmailConfirmation = () => {
  const navigate = useNavigate()
  const query = useQuery()
  const { logout } = useLogout()
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
        <div className="email-confirmation__header">Congratulations</div>
        {isLoading ? (
          <div className="email-confirmation__loader">
            <AppIcon color="accent-color" size="large" name="loader" />
          </div>
        ) : (
          <>
            <div className="paragraph-text">
              Email
              <span className="header-text"> {email} </span>
              confirmed
            </div>
            <AppButton text="Go to app" onClick={() => navigate(RouteNamesEnum.Login)} />
          </>
        )}
      </div>
    </div>
  )
}
