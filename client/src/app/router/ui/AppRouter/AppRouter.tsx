import { RouteNames } from 'common-types'
import { Routes, Route, Navigate } from 'react-router-dom'
import { privateRoutes, publicRoutes } from 'src/app/router/routes'
import { useTypedSelector } from 'src/shared/lib'
import { IRoute } from '../../types'

export const AppRouter = () => {
  const { isAuth } = useTypedSelector((state) => state.user)
  const convertedRouteProps = (route: IRoute): { path: string; element: React.ReactElement; exact: boolean } => {
    return {
      element: <route.component />,
      path: route.path,
      exact: true
    }
  }

  return isAuth ? (
    <Routes>
      <Route path="*" element={<Navigate to={RouteNames.MAIN} />} />
      {privateRoutes.map((route: IRoute, idx) => (
        <Route {...convertedRouteProps(route)} key={idx} />
      ))}
    </Routes>
  ) : (
    <Routes>
      <Route path="*" element={<Navigate to={RouteNames.SIGN_IN} replace />} />
      {publicRoutes.map((route: IRoute, idx) => (
        <Route {...convertedRouteProps(route)} key={idx} />
      ))}
    </Routes>
  )
}
