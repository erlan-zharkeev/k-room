import './style.scss'
import { ReactNode } from 'react'
import { RouteNamesEnum } from 'common-types'
import { Link, useLocation } from 'react-router-dom'

export const AuthTabsLayout = (props: { children: ReactNode; hideAuthNav?: boolean }) => {
  const location = useLocation()
  const path = location.pathname
  const isPathEqual = (linkPath: string) => (linkPath.includes(path) ? 'header-text--accent active' : '')

  return (
    <div className="auth-tabs-layout">
      <div className="auth-tabs-layout__body">
        {!props.hideAuthNav && (
          <nav className="auth-tabs-layout__nav">
            <Link
              to={RouteNamesEnum.Login}
              className={`header-text header-text--lg ${isPathEqual(RouteNamesEnum.Login)}`}
            >
              Login
            </Link>
            <Link
              to={RouteNamesEnum.Registration}
              className={`header-text header-text--lg ${isPathEqual(RouteNamesEnum.Registration)}`}
            >
              Register
            </Link>
          </nav>
        )}
        {props.children}
      </div>
    </div>
  )
}
