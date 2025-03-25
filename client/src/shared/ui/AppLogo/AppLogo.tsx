import './style.scss'
import { RouteNames } from 'common-types'
import { AppButton } from '../AppButton/AppButton'
import { useNavigate } from 'react-router-dom'

export const AppLogo = () => {
  const navigate = useNavigate()

  return (
    <div className="app-logo">
      <AppButton prefixIconName="logo" borderless onClick={() => navigate(RouteNames.Main)} iconSize="large" />
    </div>
  )
}
