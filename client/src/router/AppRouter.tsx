import { RouteNames } from 'k-room.types'
import { Routes, Route, Navigate } from 'react-router-dom'
import useTypedSelector from '../hooks/useTypedSelector'
import { IRoute } from './@types/IRoute'
import { privateRoutes, publicRoutes } from './routes'

const AppRouter = () => {
  const { isAuth } = useTypedSelector((state) => state.persist.auth)
  const convertedRouteProps = (
    route: IRoute
  ): { key: string; path: string; element: React.ReactElement; exact: boolean } => {
    return { key: route.path, element: <route.component />, path: route.path, exact: true }
  }
  return isAuth ? (
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
