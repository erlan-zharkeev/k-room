import { AUTH_ROUTE_NAMES, LAYOUT_ROUTE_NAMES, PAGE_ROUTE_NAMES, ROUTE_NAMES, isString } from 'global-shared'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useSettings, type DeviceSetting } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { APP_PAGE_ROUTES } from 'src/features/app-navigation'
import { initClientData, useLogoutNavigation } from 'src/features/client-session'
import { DEFAULT_SETTINGS_CONTENT_ID } from 'src/pages/settings'

import { isDynamicImportFetchError, recoverNativeDesktopChunkLoad } from './lib/native-desktop-cache'
import { getAppPathFromSettings, getContentTabFromPath } from './lib/router'

const loadAppLayout = () => import('./layouts/app-layout/AppLayout.vue')
const loadAuthLayout = () => import('./layouts/auth-layout/AuthLayout.vue')
const loadDocsLayout = () => import('./layouts/docs-layout/DocsLayout.vue')
const loadPageLayout = () => import('./layouts/page-layout/PageLayout.vue')

const loadCallsPage = () => import('src/pages/calls').then(({ CallsPage }) => CallsPage)
const loadContactsPage = () => import('src/pages/contacts').then(({ ContactsPage }) => ContactsPage)
const loadCreateNewPasswordPage = () =>
  import('src/pages/create-new-password').then(({ CreateNewPasswordPage }) => CreateNewPasswordPage)
const loadDownloadPage = () => import('src/pages/download').then(({ DownloadPage }) => DownloadPage)
const loadEmailConfirmationPage = () =>
  import('src/pages/email-confirmation').then(({ EmailConfirmationPage }) => EmailConfirmationPage)
const loadErrorPage = () => import('src/pages/error').then(({ ErrorPage }) => ErrorPage)
const loadLoginPage = () => import('src/pages/login').then(({ LoginPage }) => LoginPage)
const loadPasswordRecoveryPage = () =>
  import('src/pages/password-recovery').then(({ PasswordRecoveryPage }) => PasswordRecoveryPage)
const loadPrivacyPolicyPage = () =>
  import('src/pages/privacy-policy').then(({ PrivacyPolicyPage }) => PrivacyPolicyPage)
const loadRegistrationPage = () => import('src/pages/registration').then(({ RegistrationPage }) => RegistrationPage)
const loadSettingsContentPage = () =>
  import('src/pages/settings').then(({ SettingsContentPage }) => SettingsContentPage)
const loadSettingsNavigationPage = () =>
  import('src/pages/settings').then(({ SettingsNavigationPage }) => SettingsNavigationPage)
const loadWaitEmailConfirmPage = () =>
  import('src/pages/wait-email-confirm').then(({ WaitEmailConfirmPage }) => WaitEmailConfirmPage)

const loadChatRoomContent = () => import('src/widgets/chat-room-content').then(({ ChatRoomContent }) => ChatRoomContent)
const loadChatRoomsNavigation = () =>
  import('src/widgets/chat-rooms-navigation').then(({ ChatRoomsNavigation }) => ChatRoomsNavigation)

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: ROUTE_NAMES.app
  },
  {
    path: LAYOUT_ROUTE_NAMES.auth,
    component: loadAuthLayout,
    redirect: ROUTE_NAMES.authLogin,
    meta: {
      guestOnly: true
    },
    children: [
      {
        path: AUTH_ROUTE_NAMES.login,
        component: loadLoginPage
      },
      {
        path: AUTH_ROUTE_NAMES.registration,
        component: loadRegistrationPage
      }
    ]
  },
  {
    path: LAYOUT_ROUTE_NAMES.page,
    component: loadPageLayout,
    redirect: ROUTE_NAMES.notFound,
    children: [
      {
        path: PAGE_ROUTE_NAMES.emailConfirmation,
        component: loadEmailConfirmationPage
      },
      {
        path: PAGE_ROUTE_NAMES.waitEmailConfirm,
        component: loadWaitEmailConfirmPage,
        meta: {
          guestOnly: true
        }
      },
      {
        path: PAGE_ROUTE_NAMES.passwordRecovery,
        component: loadPasswordRecoveryPage,
        meta: {
          guestOnly: true
        }
      },
      {
        path: PAGE_ROUTE_NAMES.createNewPassword,
        component: loadCreateNewPasswordPage,
        meta: {
          guestOnly: true
        }
      }
    ]
  },
  {
    path: LAYOUT_ROUTE_NAMES.docs,
    component: loadDocsLayout,
    redirect: ROUTE_NAMES.privacyPolicy,
    children: [
      {
        path: PAGE_ROUTE_NAMES.privacyPolicy,
        component: loadPrivacyPolicyPage
      }
    ]
  },
  {
    path: ROUTE_NAMES.download,
    component: loadDownloadPage
  },
  {
    path: LAYOUT_ROUTE_NAMES.app,
    component: loadAppLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'chat-rooms/:chatRoomId?',
        components: {
          'content-navigation': loadChatRoomsNavigation,
          content: loadChatRoomContent
        }
      },
      {
        path: 'calls',
        components: {
          'content-navigation': loadCallsPage,
          content: loadChatRoomContent
        }
      },
      {
        path: 'contacts',
        components: {
          'content-navigation': loadContactsPage,
          content: loadChatRoomContent
        }
      },
      {
        path: 'settings',
        redirect: `${APP_PAGE_ROUTES.settings}/${DEFAULT_SETTINGS_CONTENT_ID}`
      },
      {
        path: 'settings/:settingsId',
        components: {
          'content-navigation': loadSettingsNavigationPage,
          content: loadSettingsContentPage
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    component: loadPageLayout,
    children: [
      {
        path: '',
        component: loadErrorPage
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.onError((error) => {
  if (!isDynamicImportFetchError(error)) return

  void recoverNativeDesktopChunkLoad()
})

router.beforeEach(async (to) => {
  const { user } = useUser()
  const { settings, shallowUpdate } = useSettings()
  const { isLogoutNavigationActive } = useLogoutNavigation()

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

  if (to.meta.guestOnly && isUserAuthorized && !isLogoutNavigationActive.value) {
    return ROUTE_NAMES.app
  }

  if (!to.meta.requiresAuth || !isUserAuthorized) return

  if (to.path === ROUTE_NAMES.app) {
    return getAppPathFromSettings(settings.value)
  }

  const contentTab = getContentTabFromPath(to.path)

  if (!contentTab) return

  const chatRoomId = contentTab === 'chat-rooms' && isString(to.params.chatRoomId) ? to.params.chatRoomId : ''
  const changes: Partial<DeviceSetting> = {}

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
