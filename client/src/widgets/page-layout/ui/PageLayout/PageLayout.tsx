import './style.scss'
import { RouteNamesEnum as R } from 'common'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { PAGE_LAYOUT_I18N } from 'src/widgets/page-layout/config'

import { useI18n } from 'src/entities/settings'

import { AppButton, AppIcon, AppLogo } from 'src/shared/ui'

export const PageLayout = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useI18n()

  const hiddenBackRoutes = new Set<R>([R.Login, R.Registration])
  const showBack = !hiddenBackRoutes.has(pathname as R)

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate(R.Main, { replace: true })
  }

  return (
    <div className="page-layout">
      <div className="page-layout__wrapper">
        <div className="page-layout__top-side">
          <AppLogo />
          {showBack && (
            <AppButton borderless onClick={handleBack}>
              <AppIcon name="arrow-left" />
              {t(PAGE_LAYOUT_I18N.back)}
            </AppButton>
          )}
        </div>
        <div className="page-layout__outlet-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
