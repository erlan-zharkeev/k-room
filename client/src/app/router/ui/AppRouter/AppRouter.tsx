import { RouteNamesEnum } from 'common-types'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CreateNewPassword } from 'src/pages/create-new-password'
import { EmailConfirmation } from 'src/pages/email-confrimation'
import { Login } from 'src/pages/login'
import { Main } from 'src/pages/main'
import { PasswordRecovery } from 'src/pages/password-recovery'
import { PrivacyPolicy } from 'src/pages/privacy-policy'
import { Registration } from 'src/pages/registration'
import { WaitEmailConfirm } from 'src/pages/wait-email-confirm'
import { PageLayout } from 'src/widgets/page-layout'

export const AppRouter = () => {
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
        <Route path="*" element={<Navigate to={RouteNamesEnum.NotFound} replace />} />
      </Route>
      <Route path={RouteNamesEnum.Main} element={<Main />} />
    </Routes>
  )
}
