import './style.scss'
import { ReactNode } from 'react'
import { Icon, Logo } from 'src/shared/ui'
import { RouteNames } from 'common-types'
import { Link, useLocation } from 'react-router-dom'
import { useTypedSelector } from 'src/shared/lib'

export const AuthLayout = (props: { children: ReactNode; hideAuthNav?: boolean }) => {
  const { isAppLoading } = useTypedSelector((state) => state.system)
  const location = useLocation()
  const path = location.pathname
  const isPathEqual = (linkPath: string) => (linkPath.includes(path) ? 'header-text--accent active' : '')

  return (
    <div className="page auth-layout">
      {isAppLoading ? (
        <div className="auth-layout__loader">
          <div className="auth-layout__loader-content">
            <Icon name="loader" color="accent" size="large" />
            <h3 className="header-text header-text--md">Loading</h3>
          </div>
        </div>
      ) : (
        <>
          <Logo />
          <div className="auth-layout__wrapper">
            <div className="auth-layout__body">
              {!props.hideAuthNav && (
                <nav className="auth-nav">
                  <Link
                    to={RouteNames.SIGN_IN}
                    className={`header-text header-text--lg ${isPathEqual(RouteNames.SIGN_IN)}`}
                  >
                    Login
                  </Link>
                  <Link
                    to={RouteNames.SIGN_UP}
                    className={`header-text header-text--lg ${isPathEqual(RouteNames.SIGN_UP)}`}
                  >
                    Register
                  </Link>
                </nav>
              )}
              {props.children}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
