import { createGlobalState } from '@vueuse/core'
import { getAppSettingsPath } from 'global-shared'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSettings } from 'src/entities/setting'
import { captureClientSentryException, isBrowserPushSupported, isInstalledPwa, useScreen } from 'src/shared/lib'

import { BROWSER_PUSH_PERMISSION_I18N } from '../config/i18n'

export const useBrowserPushPermission = createGlobalState(() => {
  const router = useRouter()
  const route = useRoute()
  const { isPortraitTabletOrLess } = useScreen()
  const { settings, setByPath } = useSettings()
  const isBrowserPushPermissionDialogVisible = ref(false)
  const browserNotificationPermission = ref<NotificationPermission>('default')
  const isBrowserNotificationPermissionDenied = computed(() => browserNotificationPermission.value === 'denied')
  const isBrowserNotificationPermissionRequesting = ref(false)
  const browserPushPermissionTitle = computed(() =>
    isBrowserNotificationPermissionDenied.value
      ? BROWSER_PUSH_PERMISSION_I18N.deniedTitle
      : BROWSER_PUSH_PERMISSION_I18N.title
  )
  const browserPushPermissionDescription = computed(() =>
    isBrowserNotificationPermissionDenied.value
      ? BROWSER_PUSH_PERMISSION_I18N.deniedDescription
      : BROWSER_PUSH_PERMISSION_I18N.description
  )

  const resolveBrowserNotificationPermission = () => {
    return isBrowserPushSupported() ? Notification.permission : 'denied'
  }

  const hasEnabledBrowserPushNotifications = () => {
    const { calls, enabled, general, groupCalls, invites, messages } = settings.value.notifications
    const hasEnabledGroup = calls.browserPush || groupCalls.browserPush || invites.browserPush || messages.browserPush

    return enabled && general.browserPush && hasEnabledGroup
  }

  const openPendingBrowserPushPermissionDialog = () => {
    browserNotificationPermission.value = resolveBrowserNotificationPermission()
    const notifications = settings.value.notifications
    const canRequestPermission = browserNotificationPermission.value !== 'granted'
    const shouldOpenDialog =
      isInstalledPwa() &&
      isBrowserPushSupported() &&
      hasEnabledBrowserPushNotifications() &&
      !notifications.browserPushPermissionPromptDismissed &&
      canRequestPermission

    isBrowserPushPermissionDialogVisible.value = shouldOpenDialog

    return shouldOpenDialog
  }

  const dismissBrowserPushPermissionDialog = async () => {
    await setByPath('notifications.browserPushPermissionPromptDismissed', true)
    isBrowserPushPermissionDialogVisible.value = false
  }

  const requestBrowserPushPermission = async () => {
    if (!isBrowserPushSupported() || isBrowserNotificationPermissionRequesting.value) {
      return browserNotificationPermission.value
    }

    isBrowserNotificationPermissionRequesting.value = true

    try {
      browserNotificationPermission.value = await Notification.requestPermission()

      if (browserNotificationPermission.value === 'granted') {
        isBrowserPushPermissionDialogVisible.value = false
      }
    } catch (error) {
      captureClientSentryException(error)
      browserNotificationPermission.value = resolveBrowserNotificationPermission()
    } finally {
      isBrowserNotificationPermissionRequesting.value = false
    }

    return browserNotificationPermission.value
  }

  const openBrowserPushNotificationSettings = async () => {
    await dismissBrowserPushPermissionDialog()
    await router.push({
      path: getAppSettingsPath('notifications'),
      query: isPortraitTabletOrLess.value ? { ...route.query, view: 'content' } : route.query
    })
  }

  return {
    browserNotificationPermission,
    browserPushPermissionDescription,
    browserPushPermissionTitle,
    dismissBrowserPushPermissionDialog,
    isBrowserNotificationPermissionDenied,
    isBrowserNotificationPermissionRequesting,
    isBrowserPushPermissionDialogVisible,
    openBrowserPushNotificationSettings,
    openPendingBrowserPushPermissionDialog,
    requestBrowserPushPermission
  }
})
