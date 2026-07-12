import {
  NOTIFICATION_ENDPOINTS,
  type WebPushConfigResponse,
  type WebPushSubscriptionEnabledGroups
} from 'global-shared'
import { computed, onBeforeUnmount, onMounted, watch, type WatchStopHandle } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useHttp } from 'src/shared/api'
import { isBrowserPushSupported } from 'src/shared/lib'

import {
  buildWebPushSubscriptionPayload,
  deleteCurrentWebPushSubscription,
  hasEnabledWebPushGroups,
  subscribeToWebPush
} from '../lib/web-push'

export const useWebPushSubscription = () => {
  const { settings } = useSettings()
  const { doHttpRequest } = useHttp()
  let stopSettingsWatch: WatchStopHandle | null = null
  let isSyncing = false
  let hasPendingSync = false

  const enabledGroups = computed<WebPushSubscriptionEnabledGroups>(() => {
    const { calls, enabled, general, groupCalls, invites, messages } = settings.value.notifications
    const generalBrowserPushEnabled = enabled && general.browserPush

    return {
      calls: generalBrowserPushEnabled && calls.browserPush,
      groupCalls: generalBrowserPushEnabled && groupCalls.browserPush,
      invites: generalBrowserPushEnabled && invites.browserPush,
      messages: generalBrowserPushEnabled && messages.browserPush
    }
  })
  const enabledGroupsKey = computed(() => {
    const { calls, groupCalls, invites, messages } = enabledGroups.value

    return `${Number(calls)}:${Number(groupCalls)}:${Number(invites)}:${Number(messages)}`
  })

  const deleteServerWebPushSubscription = async (endpoint: string) => {
    await doHttpRequest<null>(
      'delete',
      NOTIFICATION_ENDPOINTS.deleteWebPushSubscription,
      { endpoint },
      {
        showErrorToast: false,
        showSuccessToast: false
      }
    )
  }

  const deleteWebPushSubscription = async () => {
    const deletedSubscription = await deleteCurrentWebPushSubscription()

    if (!deletedSubscription?.endpoint) return

    await deleteServerWebPushSubscription(deletedSubscription.endpoint)
  }

  const upsertWebPushSubscription = async (publicKey: string, groups: WebPushSubscriptionEnabledGroups) => {
    const subscription = await subscribeToWebPush(publicKey)

    if (!subscription) return

    const payload = buildWebPushSubscriptionPayload(subscription, groups)

    if (!payload) return

    await doHttpRequest<null>('post', NOTIFICATION_ENDPOINTS.upsertWebPushSubscription, payload, {
      showErrorToast: false,
      showSuccessToast: false
    })
  }

  const syncWebPushSubscriptionNow = async () => {
    if (!isBrowserPushSupported()) return

    const groups = enabledGroups.value
    const shouldDisableWebPush = !hasEnabledWebPushGroups(groups) || Notification.permission !== 'granted'

    if (shouldDisableWebPush) {
      await deleteWebPushSubscription()
      return
    }

    const response = await doHttpRequest<WebPushConfigResponse>(
      'get',
      NOTIFICATION_ENDPOINTS.getWebPushConfig,
      undefined,
      {
        showErrorToast: false,
        showSuccessToast: false
      }
    )
    const { enabled, publicKey } = response.data.payload

    if (!enabled || !publicKey) {
      await deleteWebPushSubscription()
      return
    }

    await upsertWebPushSubscription(publicKey, groups)
  }

  const syncWebPushSubscription = async () => {
    if (isSyncing) {
      hasPendingSync = true
      return
    }

    isSyncing = true

    try {
      do {
        hasPendingSync = false
        await syncWebPushSubscriptionNow()
      } while (hasPendingSync)
    } catch (error) {
      void error
    } finally {
      isSyncing = false
    }
  }

  const syncVisibleWebPushSubscription = () => {
    if (document.visibilityState !== 'visible') return

    void syncWebPushSubscription()
  }

  onMounted(() => {
    stopSettingsWatch = watch(
      enabledGroupsKey,
      () => {
        void syncWebPushSubscription()
      },
      { immediate: true }
    )
    document.addEventListener('visibilitychange', syncVisibleWebPushSubscription)
  })

  onBeforeUnmount(() => {
    stopSettingsWatch?.()
    stopSettingsWatch = null
    document.removeEventListener('visibilitychange', syncVisibleWebPushSubscription)
  })

  return {
    syncWebPushSubscription
  }
}
