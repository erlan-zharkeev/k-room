import { RouteNames } from 'common-types'
import { IRoute } from './types'
import {
  EmailConfirm,
  NotFound,
  PasswordRecovery,
  CreateNewPassword,
  PrivacyPolicy,
  SignIn,
  SignUp,
  WaitEmailConfirm,
  Main
} from 'src/pages'

const commonRoutes: Array<IRoute> = [
  {
    path: RouteNames.EMAIL_CONFIRM,
    component: () => EmailConfirm()
  },
  {
    path: RouteNames.NOT_FOUND,
    component: () => NotFound()
  },
  {
    path: RouteNames.PASSWORD_RECOVERY,
    component: () => PasswordRecovery()
  },
  {
    path: RouteNames.CREATE_NEW_PASSWORD,
    component: () => CreateNewPassword()
  },
  {
    path: RouteNames.PRIVACY_POLICY,
    component: () => PrivacyPolicy()
  }
]

export const publicRoutes: Array<IRoute> = [
  ...commonRoutes,
  {
    path: RouteNames.EMAIL_CONFIRM,
    component: () => EmailConfirm()
  },
  {
    path: RouteNames.NOT_FOUND,
    component: () => NotFound()
  },
  {
    path: RouteNames.PASSWORD_RECOVERY,
    component: () => PasswordRecovery()
  },
  {
    path: RouteNames.CREATE_NEW_PASSWORD,
    component: () => CreateNewPassword()
  },
  {
    path: RouteNames.SIGN_IN,
    component: () => SignIn()
  },
  {
    path: RouteNames.SIGN_UP,
    component: () => SignUp()
  },
  {
    path: RouteNames.WAIT_EMAIL_CONFIRM,
    component: () => WaitEmailConfirm()
  },
  {
    path: RouteNames.PASSWORD_RECOVERY,
    component: () => PasswordRecovery()
  }
]

export const privateRoutes: Array<IRoute> = [
  ...commonRoutes,
  {
    path: RouteNames.MAIN,
    component: () => Main(),
    exact: true
  }
]
