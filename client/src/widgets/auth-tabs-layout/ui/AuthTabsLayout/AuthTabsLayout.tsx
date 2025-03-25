import './style.scss'
import { ReactNode } from 'react'
import { RouteNames } from 'common-types'
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
            <Link to={RouteNames.Login} className={`header-text header-text--lg ${isPathEqual(RouteNames.Login)}`}>
              Login
            </Link>
            <Link
              to={RouteNames.Registration}
              className={`header-text header-text--lg ${isPathEqual(RouteNames.Registration)}`}
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
