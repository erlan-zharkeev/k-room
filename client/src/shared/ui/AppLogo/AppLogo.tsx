import './style.scss'
import { RouteNamesEnum } from 'common'
import { useNavigate } from 'react-router-dom'

import { AppButton } from 'src/shared/ui'

export const AppLogo = () => {
  const navigate = useNavigate()

  return (
    <div className="app-logo">
      <AppButton prefixIconName="logo" borderless onClick={() => navigate(RouteNamesEnum.Main)} iconSize="large" />
    </div>
  )
}
