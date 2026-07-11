import {
  APP_ROUTE_NAMES,
  AUTH_ROUTE_NAMES,
  getAppSettingsPath,
  LAYOUT_ROUTE_NAMES,
  PAGE_ROUTE_NAMES,
  ROUTE_NAMES,
  isString
} from 'global-shared'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useSettings, type DeviceSetting } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { getChatRoomContentRoutePath } from 'src/features/app-navigation'
import { initClientData, useLogoutNavigation } from 'src/features/client-session'
import { getSettingsContentId } from 'src/pages/settings'

import { isDynamicImportFetchError } from './bootstrap/native-desktop-cache/lib'
import { recoverNativeDesktopChunkLoad } from './bootstrap/native-desktop-cache/native-desktop-cache-control.model'
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
const loadPwaInstallPage = () => import('src/pages/download').then(({ PwaInstallPage }) => PwaInstallPage)
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
    path: ROUTE_NAMES.pwaInstallAndroid,
    component: loadPwaInstallPage,
    props: {
      platform: 'android'
    }
  },
  {
    path: ROUTE_NAMES.pwaInstallIos,
    component: loadPwaInstallPage,
    props: {
      platform: 'ios'
    }
  },
  {
    path: LAYOUT_ROUTE_NAMES.app,
    component: loadAppLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: `${APP_ROUTE_NAMES.chatRooms}/:chatRoomId?`,
        components: {
          'content-navigation': loadChatRoomsNavigation,
          content: loadChatRoomContent
        }
      },
      {
        path: `${APP_ROUTE_NAMES.calls}/:chatRoomId?`,
        components: {
          'content-navigation': loadCallsPage,
          content: loadChatRoomContent
        }
      },
      {
        path: `${APP_ROUTE_NAMES.contacts}/:chatRoomId?`,
        components: {
          'content-navigation': loadContactsPage,
          content: loadChatRoomContent
        }
      },
      {
        path: `${APP_ROUTE_NAMES.settings}/:settingsId?`,
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

  const chatRoomId = isString(to.params.chatRoomId) ? to.params.chatRoomId : ''
  const savedChatRoomContentPath = getChatRoomContentRoutePath(contentTab, settings.value.chatRoomId)
  const settingsId = isString(to.params.settingsId) ? to.params.settingsId : ''

  if (!chatRoomId && settings.value.chatRoomId && savedChatRoomContentPath) {
    return {
      path: savedChatRoomContentPath,
      query: to.query,
      hash: to.hash
    }
  }

  if (contentTab === 'settings') {
    const settingsContentId = getSettingsContentId(settingsId)

    if (!settingsId) {
      return {
        path: getAppSettingsPath(getSettingsContentId(settings.value.settingsContentId)),
        query: to.query,
        hash: to.hash
      }
    }

    if (settingsId !== settingsContentId) {
      return {
        path: getAppSettingsPath(settingsContentId),
        query: to.query,
        hash: to.hash
      }
    }
  }

  const changes: Partial<DeviceSetting> = {}

  if (settings.value.contentTab !== contentTab) {
    changes.contentTab = contentTab
  }

  if (chatRoomId && settings.value.chatRoomId !== chatRoomId) {
    changes.chatRoomId = chatRoomId
  }

  if (contentTab === 'settings') {
    const settingsContentId = getSettingsContentId(settingsId)

    if (settings.value.settingsContentId !== settingsContentId) {
      changes.settingsContentId = settingsContentId
    }
  }

  if (Object.keys(changes).length) {
    await shallowUpdate(changes)
  }
})
