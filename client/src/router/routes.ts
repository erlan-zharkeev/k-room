import LoginPage from '../pages/SignIn/SignInPage'
import RegisterPage from '../pages/SignUp/SignUpPage'
import MainPage from '../pages/Main/MainPage'
import WaitConfirmPage from '../pages/WaitEmailConfirm/WaitEmailConfirmPage'
import ConfirmedPage from '../pages/EmailConfirm/EmailConfirmPage'
import { IRoute } from './@types/IRoute'
import { RouteNames } from './../../../types'
// import NotFoundPage from "../pages/NotFound/NotFoundPage";

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
  }
]

export const commonRoutes: Array<IRoute> = [
  {
    path: RouteNames.EMAIL_CONFIRM,
    component: ConfirmedPage
  }
  // {
  //   path: RouteNames.NOTFOUND,
  //   component: NotFoundPage,
  // },
]
