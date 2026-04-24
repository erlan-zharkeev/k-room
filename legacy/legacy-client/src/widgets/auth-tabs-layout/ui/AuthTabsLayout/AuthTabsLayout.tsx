import './style.scss'

import { Link, useLocation } from 'react-router-dom'

import { ROUTE_NAMES } from 'common'

import { IAuthTabsLayoutProps } from 'src/widgets/auth-tabs-layout/ui/AuthTabsLayout/types'
import { AUTH_TABS_LAYOUT_I18N } from 'src/widgets/auth-tabs-layout/i18n'

import { createClassNameWithModifiers } from 'src/shared/lib'
import { useI18n } from 'src/shared/preferences'
import { AppHeader } from 'src/shared/ui'

export const AuthTabsLayout = ({ children, blockNavigation }: IAuthTabsLayoutProps) => {
  const location = useLocation()
  const { t } = useI18n()
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
          <AppHeader accent={isPathEqual(ROUTE_NAMES.login)} additionalClassName="auth-tabs-layout__login-link">
            <Link to={ROUTE_NAMES.login}>{t(AUTH_TABS_LAYOUT_I18N.login)}</Link>
          </AppHeader>
          <AppHeader accent={isPathEqual(ROUTE_NAMES.registration)}>
            <Link to={ROUTE_NAMES.registration}>{t(AUTH_TABS_LAYOUT_I18N.register)}</Link>
          </AppHeader>
        </nav>
        {children}
      </div>
    </div>
  )
}
