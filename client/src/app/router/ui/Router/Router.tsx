import { RouteNamesEnum as R } from 'common-types'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'

import { CreateNewPassword } from 'src/pages/create-new-password'
import { EmailConfirmation } from 'src/pages/email-confirmation'
import { Login } from 'src/pages/login'
import { Main } from 'src/pages/main'
import { PasswordRecovery } from 'src/pages/password-recovery'
import { PrivacyPolicy } from 'src/pages/privacy-policy'
import { Registration } from 'src/pages/registration'
import { WaitEmailConfirm } from 'src/pages/wait-email-confirm'

import { PageLayout } from 'src/widgets/page-layout'

import { useSystem } from 'src/entities/system'

import { PATH_TO_REDIRECT_IF_AUTHORIZED } from '../../config'

const PrivateRoute = () => {
  const { auth } = useSystem()
  const location = useLocation()
  return auth === 'authorized' ? <Outlet /> : <Navigate to={R.Login} replace state={{ from: location }} />
}

const PublicRoute = () => {
  const { auth } = useSystem()
  const location = useLocation()
  const isPathValidToRedirect = PATH_TO_REDIRECT_IF_AUTHORIZED.includes(location.pathname as R)
  return auth === 'authorized' && isPathValidToRedirect ? <Navigate to={R.Main} replace /> : <Outlet />
}

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={R.Main} replace />} />

      <Route element={<PublicRoute />}>
        <Route element={<PageLayout />}>
          <Route path={R.Login} element={<Login />} />
          <Route path={R.Registration} element={<Registration />} />
          <Route path={R.EmailConfirmation} element={<EmailConfirmation />} />
          <Route path={R.WaitEmailConfirm} element={<WaitEmailConfirm />} />

          <Route path={R.PrivacyPolicy} element={<PrivacyPolicy />} />
          <Route path={R.PasswordRecovery} element={<PasswordRecovery />} />
          <Route path={R.CreateNewPassword} element={<CreateNewPassword />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path={R.Main} element={<Main />} />
      </Route>

      <Route path="*" element={<Navigate to={R.Main} replace />} />
    </Routes>
  )
}
