import './style.scss'
import { AppLogo } from 'src/shared/ui'
import { Outlet } from 'react-router-dom'

export const PageLayout = () => {
  return (
    <div className="page-layout">
      <div className="page-layout__wrapper">
        <AppLogo />
        <Outlet />
      </div>
    </div>
  )
}
