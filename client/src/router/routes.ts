import { RouteNames } from 'common-types'
import { IRoute } from 'src/@types'
import {
  NotFoundPage,
  PasswordRecoveryPage,
  CreateNewPasswordPage,
  PrivacyPolicyPage,
  MainPage,
  EmailConfirmPage,
  SignInPage,
  SignUpPage,
  WaitEmailConfirmPage,
} from 'src/pages'

const commonRoutes: Array<IRoute> = [
  {
    path: RouteNames.EMAIL_CONFIRM,
    component: () => EmailConfirmPage()
  },
  {
    path: RouteNames.NOT_FOUND,
    component: () => NotFoundPage()
  },
  {
    path: RouteNames.PASSWORD_RECOVERY,
    component: () => PasswordRecoveryPage()
  },
  {
    path: RouteNames.CREATE_NEW_PASSWORD,
    component: () => CreateNewPasswordPage()
  },
  {
    path: RouteNames.PRIVACY_POLICY,
    component: () => PrivacyPolicyPage()
  }
]

export const publicRoutes: Array<IRoute> = [
  ...commonRoutes,
  {
    path: RouteNames.EMAIL_CONFIRM,
    component: () => EmailConfirmPage()
  },
  {
    path: RouteNames.NOT_FOUND,
    component: () => NotFoundPage()
  },
  {
    path: RouteNames.PASSWORD_RECOVERY,
    component: () => PasswordRecoveryPage()
  },
  {
    path: RouteNames.CREATE_NEW_PASSWORD,
    component: () => CreateNewPasswordPage()
  },
  {
    path: RouteNames.SIGN_IN,
    component: () => SignInPage()
  },
  {
    path: RouteNames.SIGN_UP,
    component: () => SignUpPage()
  },
  {
    path: RouteNames.WAIT_EMAIL_CONFIRM,
    component: () => WaitEmailConfirmPage()
  },
  {
    path: RouteNames.PASSWORD_RECOVERY,
    component: () => PasswordRecoveryPage()
  }
]

export const privateRoutes: Array<IRoute> = [
  ...commonRoutes,
  {
    path: RouteNames.MAIN,
    component: () => MainPage(),
    exact: true
  }
]
