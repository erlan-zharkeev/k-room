import './style.scss'

import { RouteNamesEnum } from 'common-types'
import { Link, useLocation } from 'react-router-dom'

import type { AuthTabsLayoutProps } from 'src/widgets/auth-tabs-layout'

import { AppHeader } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const AuthTabsLayout = ({ children, blockNavigation }: AuthTabsLayoutProps) => {
  const location = useLocation()
  const path = location.pathname

  const isPathEqual = (linkPath: string) => linkPath.includes(path)
  const navClassName = createClassNameWithModifiers({
    rootClass: 'auth-tabs-layout__nav',
    modifiers: [blockNavigation && 'block']
  })

  return (
    <div className="auth-tabs-layout">
      <div className="auth-tabs-layout__body">
        <nav className={navClassName}>
          <AppHeader accent={isPathEqual(RouteNamesEnum.Login)} additionalClassName="auth-tabs-layout__login-link">
            <Link to={RouteNamesEnum.Login}>Login</Link>
          </AppHeader>
          <AppHeader accent={isPathEqual(RouteNamesEnum.Registration)}>
            <Link to={RouteNamesEnum.Registration}>Register</Link>
          </AppHeader>
        </nav>
        {children}
      </div>
    </div>
  )
}
