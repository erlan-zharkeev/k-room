import './style.scss'
import { Outlet } from 'react-router-dom'

import { AppLogo } from 'src/shared/ui'

export const PageLayout = () => {
  return (
    <div className="page-layout">
      <div className="page-layout__wrapper">
        <AppLogo />
        <div className="page-layout__outlet-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
