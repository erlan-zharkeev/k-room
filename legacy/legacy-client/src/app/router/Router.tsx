import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'

import { ROUTE_NAMES as R } from 'common'

import { PATH_TO_REDIRECT_IF_AUTHORIZED } from 'src/app/router/constants'
import { CreateNewPassword } from 'src/pages/create-new-password'
import { EmailConfirmation } from 'src/pages/email-confirmation'
import { Login } from 'src/pages/login'
import { Main } from 'src/pages/main'
import { PasswordRecovery } from 'src/pages/password-recovery'
import { PrivacyPolicy } from 'src/pages/privacy-policy'
import { Registration } from 'src/pages/registration'
import { WaitEmailConfirm } from 'src/pages/wait-email-confirm'
import { useSystem } from 'src/shared/system'
import { PageLayout } from 'src/widgets/page-layout'

const PrivateRoute = () => {
  const { auth } = useSystem()
  const location = useLocation()

  return auth === 'authorized' ? <Outlet /> : <Navigate to={R.login} replace state={{ from: location }} />
}

const PublicRoute = () => {
  const { auth } = useSystem()
  const location = useLocation()
  const isPathValidToRedirect = PATH_TO_REDIRECT_IF_AUTHORIZED.includes(
    location.pathname as (typeof PATH_TO_REDIRECT_IF_AUTHORIZED)[number]
  )

  return auth === 'authorized' && isPathValidToRedirect ? <Navigate to={R.main} replace /> : <Outlet />
}

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={R.main} replace />} />

      <Route element={<PublicRoute />}>
        <Route element={<PageLayout />}>
          <Route path={R.login} element={<Login />} />
          <Route path={R.registration} element={<Registration />} />
          <Route path={R.emailConfirmation} element={<EmailConfirmation />} />
          <Route path={R.waitEmailConfirm} element={<WaitEmailConfirm />} />

          <Route path={R.privacyPolicy} element={<PrivacyPolicy />} />
          <Route path={R.passwordRecovery} element={<PasswordRecovery />} />
          <Route path={R.createNewPassword} element={<CreateNewPassword />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path={R.main} element={<Main />} />
      </Route>

      <Route path="*" element={<Navigate to={R.main} replace />} />
    </Routes>
  )
}
