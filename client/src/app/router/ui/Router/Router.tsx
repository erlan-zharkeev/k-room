import { RouteNamesEnum } from 'common-types'
import { Routes, Route, Navigate } from 'react-router-dom'

import { CreateNewPassword } from 'src/pages/create-new-password'
import { EmailConfirmation } from 'src/pages/email-confirmation'
import { Login } from 'src/pages/login'
import { Main } from 'src/pages/main'
import { PasswordRecovery } from 'src/pages/password-recovery'
import { PrivacyPolicy } from 'src/pages/privacy-policy'
import { Registration } from 'src/pages/registration'
import { WaitEmailConfirm } from 'src/pages/wait-email-confirm'

import { PageLayout } from 'src/widgets/page-layout'

import { useUser } from 'src/entities/user'

export const Router = () => {
  const { isAuth } = useUser()
  const redirectTo = isAuth ? RouteNamesEnum.Main : RouteNamesEnum.Login

  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path={RouteNamesEnum.Login} element={<Login />} />
        <Route path={RouteNamesEnum.Registration} element={<Registration />} />
        <Route path={RouteNamesEnum.EmailConfirmation} element={<EmailConfirmation />} />
        <Route path={RouteNamesEnum.PrivacyPolicy} element={<PrivacyPolicy />} />
        <Route path={RouteNamesEnum.PasswordRecovery} element={<PasswordRecovery />} />
        <Route path={RouteNamesEnum.CreateNewPassword} element={<CreateNewPassword />} />
        <Route path={RouteNamesEnum.WaitEmailConfirm} element={<WaitEmailConfirm />} />
        <Route path="*" element={<Navigate to={redirectTo} replace />} />
      </Route>
      <Route path={RouteNamesEnum.Main} element={<Main />} />
    </Routes>
  )
}
