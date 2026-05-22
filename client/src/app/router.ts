import { AUTH_ROUTE_NAMES, LAYOUT_ROUTE_NAMES, PAGE_ROUTE_NAMES, ROUTE_NAMES } from 'global-shared'
import { isString } from 'lodash'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useSettings, type DbDeviceSetting } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { initClientData } from 'src/features/client-session'
import { ChatRoomPage, ChatRoomsNavigationPage } from 'src/pages/chat-room'
import { ContactsPage } from 'src/pages/contacts'
import { CreateNewPasswordPage } from 'src/pages/create-new-password'
import { EmailConfirmationPage } from 'src/pages/email-confirmation'
import { ErrorPage } from 'src/pages/error'
import { LoginPage } from 'src/pages/login'
import { PasswordRecoveryPage } from 'src/pages/password-recovery'
import { PrivacyPolicyPage } from 'src/pages/privacy-policy'
import { RegistrationPage } from 'src/pages/registration'
import { DEFAULT_SETTINGS_CONTENT_ID, SettingsContentPage, SettingsNavigationPage } from 'src/pages/settings'
import { WaitEmailConfirmPage } from 'src/pages/wait-email-confirm'

import AppLayout from './layouts/app-layout/AppLayout.vue'
import AuthLayout from './layouts/auth-layout/AuthLayout.vue'
import DocsLayout from './layouts/docs-layout/DocsLayout.vue'
import PageLayout from './layouts/page-layout/PageLayout.vue'
import { getAppPathFromSettings, getContentTabFromPath } from './lib/router'

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
    component: AppLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'chat-rooms/:chatRoomId?',
        components: {
          'content-navigation': ChatRoomsNavigationPage,
          content: ChatRoomPage
        }
      },
      {
        path: 'calls',
        components: {
          content: ChatRoomPage
        }
      },
      {
        path: 'contacts',
        components: {
          'content-navigation': ContactsPage,
          content: ChatRoomPage
        }
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

router.beforeEach(async (to) => {
  const { user } = useUser()
  const { settings, shallowUpdate } = useSettings()

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

  if (!to.meta.requiresAuth || !isUserAuthorized) return

  if (to.path === ROUTE_NAMES.app) {
    return getAppPathFromSettings(settings.value)
  }

  const contentTab = getContentTabFromPath(to.path)

  if (!contentTab) return

  const chatRoomId = contentTab === 'chat-rooms' && isString(to.params.chatRoomId) ? to.params.chatRoomId : ''
  const changes: Partial<DbDeviceSetting> = {}

  if (settings.value.contentTab !== contentTab) {
    changes.contentTab = contentTab
  }

  if (contentTab === 'chat-rooms' && settings.value.chatRoomId !== chatRoomId) {
    changes.chatRoomId = chatRoomId
  }

  if (Object.keys(changes).length) {
    await shallowUpdate(changes)
  }
})
