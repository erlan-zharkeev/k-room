import LoginPage from 'src/pages/SignIn/SignInPage'
import RegisterPage from 'src/pages/SignUp/SignUpPage'
import MainPage from 'src/pages/Main/MainPage'
import WaitConfirmPage from 'src/pages/WaitEmailConfirm/WaitEmailConfirmPage'
import ConfirmedPage from 'src/pages/EmailConfirm/EmailConfirmPage'
import NotFoundPage from 'src/pages/NotFound/NotFoundPage'
import PasswordRecoveryPage from 'src/pages/PasswordRecovery/PasswordRecoveryPage'

import { IRoute } from './@types/IRoute'
import { RouteNames } from 'common-types'

export const publicRoutes: Array<IRoute> = [
  {
    path: RouteNames.EMAIL_CONFIRM,
    component: ConfirmedPage
  },
  {
    path: RouteNames.SIGN_IN,
    component: LoginPage
  },
  {
    path: RouteNames.SIGN_UP,
    component: RegisterPage
  },
  {
    path: RouteNames.WAIT_EMAIL_CONFIRM,
    component: WaitConfirmPage
  },
  {
    path: RouteNames.NOT_FOUND,
    component: NotFoundPage
  },
  {
    path: RouteNames.PASSWORD_RECOVERY,
    component: PasswordRecoveryPage
  }
]

export const privateRoutes: Array<IRoute> = [
  {
    path: RouteNames.EMAIL_CONFIRM,
    component: ConfirmedPage
  },
  {
    path: RouteNames.MAIN,
    component: MainPage,
    exact: true
  },
  {
    path: RouteNames.NOT_FOUND,
    component: NotFoundPage
  },
  {
    path: RouteNames.PASSWORD_RECOVERY,
    component: PasswordRecoveryPage
  }
]
