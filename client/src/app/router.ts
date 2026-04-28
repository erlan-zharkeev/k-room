import { AUTH_ROUTE_NAMES, LAYOUT_ROUTE_NAMES, PAGE_ROUTE_NAMES, ROUTE_NAMES } from 'global-shared'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useUser } from 'src/entities/user'
import { initClientData } from 'src/features/client-session'
import { CREATE_NEW_PASSWORD_PAGE_LAYOUT_PROPS, CreateNewPasswordPage } from 'src/pages/create-new-password'
import { EMAIL_CONFIRMATION_PAGE_LAYOUT_PROPS, EmailConfirmationPage } from 'src/pages/email-confirmation'
import { ERROR_PAGE_LAYOUT_PROPS, ErrorPage } from 'src/pages/error'
import { LoginPage } from 'src/pages/login'
import { MainWorkspacePage, getMainPageSettingsPath } from 'src/pages/main'
import { PASSWORD_RECOVERY_PAGE_LAYOUT_PROPS, PasswordRecoveryPage } from 'src/pages/password-recovery'
import { PRIVACY_POLICY_PAGE_LAYOUT_PROPS, PrivacyPolicyPage } from 'src/pages/privacy-policy'
import { RegistrationPage } from 'src/pages/registration'
import { SettingsPage } from 'src/pages/settings'
import { WAIT_EMAIL_CONFIRM_PAGE_LAYOUT_PROPS, WaitEmailConfirmPage } from 'src/pages/wait-email-confirm'

import { MAIN_PAGE_ROUTES } from '../widgets/main-left-bar/config/constants'

import AuthLayout from './layouts/auth-layout/AuthLayout.vue'
import MainLayout from './layouts/main-layout/MainLayout.vue'
import PageLayout from './layouts/page-layout/PageLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: ROUTE_NAMES.app
  },
  {
    path: LAYOUT_ROUTE_NAMES.auth,
    component: AuthLayout,
    redirect: ROUTE_NAMES.authLogin,
    meta: {
      guestOnly: true
    },
    children: [
      {
        path: AUTH_ROUTE_NAMES.login,
        component: LoginPage
      },
      {
        path: AUTH_ROUTE_NAMES.registration,
        component: RegistrationPage
      }
    ]
  },
  {
    path: LAYOUT_ROUTE_NAMES.page,
    component: PageLayout,
    redirect: ROUTE_NAMES.notFound,
    children: [
      {
        path: PAGE_ROUTE_NAMES.emailConfirmation,
        component: EmailConfirmationPage,
        meta: {
          pageLayout: EMAIL_CONFIRMATION_PAGE_LAYOUT_PROPS
        }
      },
      {
        path: PAGE_ROUTE_NAMES.waitEmailConfirm,
        component: WaitEmailConfirmPage,
        meta: {
          guestOnly: true,
          pageLayout: WAIT_EMAIL_CONFIRM_PAGE_LAYOUT_PROPS
        }
      },
      {
        path: PAGE_ROUTE_NAMES.passwordRecovery,
        component: PasswordRecoveryPage,
        meta: {
          guestOnly: true,
          pageLayout: PASSWORD_RECOVERY_PAGE_LAYOUT_PROPS
        }
      },
      {
        path: PAGE_ROUTE_NAMES.createNewPassword,
        component: CreateNewPasswordPage,
        meta: {
          guestOnly: true,
          pageLayout: CREATE_NEW_PASSWORD_PAGE_LAYOUT_PROPS
        }
      },
      {
        path: PAGE_ROUTE_NAMES.privacyPolicy,
        component: PrivacyPolicyPage,
        meta: {
          pageLayout: PRIVACY_POLICY_PAGE_LAYOUT_PROPS
        }
      },
      {
        path: PAGE_ROUTE_NAMES.notFound,
        component: ErrorPage,
        meta: {
          pageLayout: ERROR_PAGE_LAYOUT_PROPS
        }
      }
    ]
  },
  {
    path: LAYOUT_ROUTE_NAMES.app,
    component: MainLayout,
    redirect: MAIN_PAGE_ROUTES.chatRooms,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'chat-rooms',
        component: MainWorkspacePage
      },
      {
        path: 'calls',
        component: MainWorkspacePage
      },
      {
        path: 'contacts',
        component: MainWorkspacePage
      },
      {
        path: 'info-notifications',
        component: MainWorkspacePage
      },
      {
        path: 'settings',
        redirect: getMainPageSettingsPath('account')
      },
      {
        path: 'settings/:settingsId',
        component: SettingsPage
      }
    ]
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

const { get: getUser } = useUser()

router.beforeEach(async (to) => {
  await initClientData()
  const user = await getUser()
  const isUserAuthorized = Boolean(user?.id)

  if (to.meta.requiresAuth && !isUserAuthorized) {
    return {
      path: ROUTE_NAMES.authLogin,
      query: {
        redirect: to.fullPath
      }
    }
  }

  if (to.meta.guestOnly && isUserAuthorized) {
    return ROUTE_NAMES.app
  }
})
