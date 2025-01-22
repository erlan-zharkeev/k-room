import { RouteNames } from 'common-types'
import { Link, useLocation } from 'react-router-dom'

export const AuthNav = () => {
  const location = useLocation()
  const path = location.pathname
  const isPathEqual = (linkPath: string) => linkPath.includes(path) ? 'header-text--accent active' : ''

  return (
    <nav className="auth-nav">
      <Link to={RouteNames.SIGN_IN} className={`header-text header-text--lg ${isPathEqual(RouteNames.SIGN_IN)}`}>
        Login
      </Link>
      <Link to={RouteNames.SIGN_UP} className={`header-text header-text--lg ${isPathEqual(RouteNames.SIGN_UP)}`}>
        Register
      </Link>
    </nav>
  )
}
