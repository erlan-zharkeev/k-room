import { RouteNames } from 'common-types'
import { Routes, Route, Navigate } from 'react-router-dom'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { IRoute } from './@types/IRoute'
import { privateRoutes, publicRoutes } from './routes'
import { LoadingOutlined } from '@ant-design/icons'
import getCookie from 'src/utils/getCookie'

const AppRouter = () => {
  const { isAuth, isAppLoading } = useTypedSelector((state) => state.auth)
  const hasJwt = getCookie('jwt')
  const showLoader = isAppLoading && hasJwt
  const convertedRouteProps = (
    route: IRoute
  ): { key: string; path: string; element: React.ReactElement; exact: boolean } => {
    return { key: route.path, element: <route.component />, path: route.path, exact: true }
  }

  return showLoader ? (
    <div className="app-loader">
      <div className="app-loader__content">
        <LoadingOutlined />
        <h3 className="header-text header-text--md">Loading</h3>
      </div>
    </div>
  ) : isAuth ? (
    <Routes>
      {privateRoutes.map((route: IRoute) => (
        <Route {...convertedRouteProps(route)} />
      ))}
      <Route path="*" element={<Navigate to={RouteNames.MAIN} replace />} />
    </Routes>
  ) : (
    <Routes>
      {publicRoutes.map((route: IRoute) => (
        <Route {...convertedRouteProps(route)} />
      ))}
      <Route path="*" element={<Navigate to={RouteNames.SIGN_IN} replace />} />
    </Routes>
  )
}

export default AppRouter
