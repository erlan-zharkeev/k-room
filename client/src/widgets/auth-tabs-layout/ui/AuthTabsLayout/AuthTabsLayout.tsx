import './style.scss'
import { ReactNode } from 'react'

import { RouteNamesEnum } from 'common-types'
import { Link, useLocation } from 'react-router-dom'

import { AppHeader } from 'src/shared/ui'

export const AuthTabsLayout = (props: { children: ReactNode; hideAuthNav?: boolean }) => {
  const location = useLocation()
  const path = location.pathname

  const isPathEqual = (linkPath: string) => linkPath.includes(path)

  return (
    <div className="auth-tabs-layout">
      <div className="auth-tabs-layout__body">
        {!props.hideAuthNav && (
          <nav className="auth-tabs-layout__nav">
            <AppHeader accent={isPathEqual(RouteNamesEnum.Login)} additionalClassName="auth-tabs-layout__login-link">
              <Link to={RouteNamesEnum.Login}>Login</Link>
            </AppHeader>
            <AppHeader accent={isPathEqual(RouteNamesEnum.Registration)}>
              <Link to={RouteNamesEnum.Registration}>Register</Link>
            </AppHeader>
          </nav>
        )}
        {props.children}
      </div>
    </div>
  )
}
