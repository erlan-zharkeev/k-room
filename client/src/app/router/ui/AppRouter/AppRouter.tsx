import { RouteNames } from 'common-types'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CreateNewPassword } from 'src/pages/create-new-password'
import { EmailConfirmation } from 'src/pages/email-confrimation'
import { Login } from 'src/pages/login'
import { Main } from 'src/pages/main'
import { NotFound } from 'src/pages/not-found'
import { PasswordRecovery } from 'src/pages/password-recovery'
import { PrivacyPolicy } from 'src/pages/privacy-policy'
import { Registration } from 'src/pages/registration'
import { WaitEmailConfirm } from 'src/pages/wait-email-confirm'
import { useTypedSelector } from 'src/shared/lib'

import { PageLayout } from 'src/widgets/page-layout'

export const AppRouter = () => {
  const { isAuth } = useTypedSelector((state) => state.user)

  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path={RouteNames.Login} element={<Login />} />
        <Route path={RouteNames.Registration} element={<Registration />} />
        <Route path={RouteNames.EmailConfirmation} element={<EmailConfirmation />} />
        <Route path={RouteNames.PrivacyPolicy} element={<PrivacyPolicy />} />
        <Route path={RouteNames.PasswordRecovery} element={<PasswordRecovery />} />
        <Route path={RouteNames.CreateNewPassword} element={<CreateNewPassword />} />
        <Route path={RouteNames.WaitEmailCofirm} element={<WaitEmailConfirm />} />
        <Route path={RouteNames.NotFound} element={<NotFound />} />
      </Route>
      {isAuth && <Route path={RouteNames.Main} element={<Main />} />}
      <Route path="*" element={<Navigate to={RouteNames.NotFound} replace />} />
    </Routes>
  )
}
