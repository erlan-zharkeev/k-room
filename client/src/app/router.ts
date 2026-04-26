import { ROUTE_NAMES } from 'global-shared'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useUser } from 'src/entities/user'
import { initClientData } from 'src/features/client-session'
import { CreateNewPasswordPage } from 'src/pages/create-new-password'
import { EmailConfirmationPage } from 'src/pages/email-confirmation'
import { ErrorPage } from 'src/pages/error'
import { LoginPage } from 'src/pages/login'
import { MAIN_PAGE_ROUTES, MainWorkspacePage, getMainPageSettingsPath } from 'src/pages/main'
import { PasswordRecoveryPage } from 'src/pages/password-recovery'
import { PrivacyPolicyPage } from 'src/pages/privacy-policy'
import { RegistrationPage } from 'src/pages/registration'
import { SettingsPage } from 'src/pages/settings'
import { WaitEmailConfirmPage } from 'src/pages/wait-email-confirm'

import MainLayout from './layouts/main/MainLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: ROUTE_NAMES.main
  },
  {
    path: ROUTE_NAMES.login,
    component: LoginPage,
    meta: {
      guestOnly: true
    }
  },
  {
    path: ROUTE_NAMES.registration,
    component: RegistrationPage,
    meta: {
      guestOnly: true
    }
  },
  {
    path: ROUTE_NAMES.emailConfirmation,
    component: EmailConfirmationPage,
    meta: {
      guestOnly: true
    }
  },
  {
    path: ROUTE_NAMES.waitEmailConfirm,
    component: WaitEmailConfirmPage,
    meta: {
      guestOnly: true
    }
  },
  {
    path: ROUTE_NAMES.main,
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
    path: ROUTE_NAMES.passwordRecovery,
    component: PasswordRecoveryPage,
    meta: {
      guestOnly: true
    }
  },
  {
    path: ROUTE_NAMES.createNewPassword,
    component: CreateNewPasswordPage,
    meta: {
      guestOnly: true
    }
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

const { get: getUser } = useUser()

router.beforeEach(async (to) => {
  await initClientData()
  const user = await getUser()
  const isUserAuthorized = Boolean(user?.id)

  if (to.meta.requiresAuth && !isUserAuthorized) {
    return {
      path: ROUTE_NAMES.login,
      query: {
        redirect: to.fullPath
      }
    }
  }

  if (to.meta.guestOnly && isUserAuthorized) {
    return ROUTE_NAMES.main
  }
})
