import { AUTH_ROUTE_NAMES, LAYOUT_ROUTE_NAMES, PAGE_ROUTE_NAMES, ROUTE_NAMES } from 'global-shared'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useUser } from 'src/entities/user'
import { initClientData } from 'src/features/client-session'
import { CreateNewPasswordPage } from 'src/pages/create-new-password'
import { EmailConfirmationPage } from 'src/pages/email-confirmation'
import { ErrorPage } from 'src/pages/error'
import { LoginPage } from 'src/pages/login'
import { MainWorkspacePage } from 'src/pages/main'
import { PasswordRecoveryPage } from 'src/pages/password-recovery'
import { PrivacyPolicyPage } from 'src/pages/privacy-policy'
import { RegistrationPage } from 'src/pages/registration'
import { DEFAULT_SETTINGS_CONTENT_ID, SettingsContentPage, SettingsNavigationPage } from 'src/pages/settings'
import { WaitEmailConfirmPage } from 'src/pages/wait-email-confirm'
import { APP_PAGE_ROUTES } from 'src/shared/config'

import AuthLayout from './layouts/auth-layout/AuthLayout.vue'
import DocsLayout from './layouts/docs-layout/DocsLayout.vue'
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
        component: EmailConfirmationPage
      },
      {
        path: PAGE_ROUTE_NAMES.waitEmailConfirm,
        component: WaitEmailConfirmPage,
        meta: {
          guestOnly: true
        }
      },
      {
        path: PAGE_ROUTE_NAMES.passwordRecovery,
        component: PasswordRecoveryPage,
        meta: {
          guestOnly: true
        }
      },
      {
        path: PAGE_ROUTE_NAMES.createNewPassword,
        component: CreateNewPasswordPage,
        meta: {
          guestOnly: true
        }
      }
    ]
  },
  {
    path: LAYOUT_ROUTE_NAMES.docs,
    component: DocsLayout,
    redirect: ROUTE_NAMES.privacyPolicy,
    children: [
      {
        path: PAGE_ROUTE_NAMES.privacyPolicy,
        component: PrivacyPolicyPage
      }
    ]
  },
  {
    path: LAYOUT_ROUTE_NAMES.app,
    component: MainLayout,
    redirect: APP_PAGE_ROUTES.chatRooms,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'chat-rooms',
        components: { content: MainWorkspacePage }
      },
      {
        path: 'calls',
        components: { content: MainWorkspacePage }
      },
      {
        path: 'contacts',
        components: { content: MainWorkspacePage }
      },
      {
        path: 'info-notifications',
        components: { content: MainWorkspacePage }
      },
      {
        path: 'settings',
        redirect: `${APP_PAGE_ROUTES.settings}/${DEFAULT_SETTINGS_CONTENT_ID}`
      },
      {
        path: 'settings/:settingsId',
        components: {
          'content-navigation': SettingsNavigationPage,
          content: SettingsContentPage
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: PageLayout,
    children: [
      {
        path: '',
        component: ErrorPage
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

const { user } = useUser()

router.beforeEach(async (to) => {
  await initClientData()
  const isUserAuthorized = Boolean(user.value.id)

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
