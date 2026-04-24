import { ROUTE_NAMES } from 'global-shared'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { CreateNewPasswordPage } from 'src/pages/create-new-password'
import { EmailConfirmationPage } from 'src/pages/email-confirmation'
import { ErrorPage } from 'src/pages/error'
import { LoginPage } from 'src/pages/login'
import { MAIN_PAGE_NAV_ITEMS, MAIN_PAGE_ROUTES, MainPage } from 'src/pages/main'
import { PasswordRecoveryPage } from 'src/pages/password-recovery'
import { PrivacyPolicyPage } from 'src/pages/privacy-policy'
import { RegistrationPage } from 'src/pages/registration'
import { WaitEmailConfirmPage } from 'src/pages/wait-email-confirm'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: ROUTE_NAMES.main
  },
  {
    path: ROUTE_NAMES.login,
    component: LoginPage
  },
  {
    path: ROUTE_NAMES.registration,
    component: RegistrationPage
  },
  {
    path: ROUTE_NAMES.emailConfirmation,
    component: EmailConfirmationPage
  },
  {
    path: ROUTE_NAMES.waitEmailConfirm,
    component: WaitEmailConfirmPage
  },
  {
    path: ROUTE_NAMES.main,
    redirect: MAIN_PAGE_ROUTES.chatRooms
  },
  ...MAIN_PAGE_NAV_ITEMS.map(({ path }) => ({
    path,
    component: MainPage
  })),
  {
    path: ROUTE_NAMES.passwordRecovery,
    component: PasswordRecoveryPage
  },
  {
    path: ROUTE_NAMES.createNewPassword,
    component: CreateNewPasswordPage
  },
  {
    path: ROUTE_NAMES.privacyPolicy,
    component: PrivacyPolicyPage
  },
  {
    path: ROUTE_NAMES.notFound,
    component: ErrorPage
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: ROUTE_NAMES.notFound
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
