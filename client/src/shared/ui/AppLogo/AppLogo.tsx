import './style.scss'
import { ROUTE_NAMES } from 'common'
import { useNavigate } from 'react-router-dom'

import { AppButton } from 'src/shared/ui'

export const AppLogo = () => {
  const navigate = useNavigate()

  return (
    <div className="app-logo">
      <AppButton prefixIconName="logo" borderless onClick={() => navigate(ROUTE_NAMES.main)} iconSize="large" />
    </div>
  )
}
