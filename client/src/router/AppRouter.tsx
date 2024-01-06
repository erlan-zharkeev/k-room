import { RouteNames } from 'common-types'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTypedSelector } from 'src/hooks'
import { IRoute } from './@types/IRoute'
import { privateRoutes, publicRoutes } from './routes'
import { useEffect } from 'react'
import { AppDispatch, resetStores } from 'src/store'
import { useDispatch } from 'react-redux'

export const AppRouter = () => {
  const { isAuth } = useTypedSelector((state) => state.user)
  const dispatch = useDispatch<AppDispatch>()

  const convertedRouteProps = (route: IRoute): { path: string; element: React.ReactElement; exact: boolean } => {
    return {
      element: <route.component />,
      path: route.path,
      exact: true
    }
  }

  useEffect(() => {
    if (!isAuth) {
      resetStores.forEach((resetStore) => dispatch(resetStore()))
    }
  }, [isAuth])

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
