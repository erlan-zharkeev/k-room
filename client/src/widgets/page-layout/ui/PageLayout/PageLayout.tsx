import './style.scss'
import { AppIcon, AppLogo } from 'src/shared/ui'
import { useTypedSelector } from 'src/shared/lib'
import { Outlet } from 'react-router-dom'

export const PageLayout = () => {
  const { isAppLoading } = useTypedSelector((state) => state.system)

  return (
    <div className="page-layout">
      {isAppLoading ? (
        <div className="page-layout__loader">
          <div className="page-layout__loader-content">
            <AppIcon name="loader" color="accent-color" size="large" />
            <h3 className="header-text header-text--md">Loading</h3>
          </div>
        </div>
      ) : (
        <div className="page-layout__wrapper">
          <AppLogo />
          <Outlet />
        </div>
      )}
    </div>
  )
}
