import { RouteNamesEnum } from 'common-types'
import './style.scss'
import { useNavigate } from 'react-router-dom'

import { useUser } from 'src/entities/user'

import { AppLink } from 'src/shared/ui'

export const PasswordRecoveryLink = () => {
  const { email } = useUser()
  const navigate = useNavigate()

  return (
    <AppLink
      text="Password recovery"
      onClick={() => navigate({ pathname: RouteNamesEnum.PasswordRecovery, search: `?user-email=${email}` })}
    />
  )
}
