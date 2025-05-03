import './style.scss'
import { RouteNamesEnum } from 'common-types'
import { useNavigate } from 'react-router-dom'

import { useUser } from 'src/entities/user'

import { AppButton } from 'src/shared/ui'

export const NotFound = () => {
  const navigate = useNavigate()
  const { isAuth } = useUser()

  const goToAppHandler = () => {
    const routeTo = isAuth ? RouteNamesEnum.Main : RouteNamesEnum.Login
    navigate(routeTo)
  }

  return (
    <div className="not-found">
      <div className="not-found__main-header">404</div>
      <div className="header-text header-text--md">Page not found</div>
      <AppButton onClick={goToAppHandler} text="Go to app" color="accent-color" />
    </div>
  )
}
