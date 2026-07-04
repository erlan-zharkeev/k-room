import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

import { useSettings, type NotificationSettingGroup, type NotificationSettingKey } from 'src/entities/setting'
import { getClientPlatform, useScreen } from 'src/shared/lib'

import {
  NOTIFICATION_CHANNEL_IDS,
  NOTIFICATION_GROUP_IDS,
  SETTINGS_NOTIFICATION_OPTIONS,
  SETTINGS_NOTIFICATION_SECTIONS
} from '../../config/constants/notifications.constants'
import type { SettingsNotificationOptionId } from '../../config/types/notifications.types'

const NOTIFICATION_PERMISSION_QUERY = { name: 'notifications' as PermissionName }

const isBrowserPushOption = (optionId: SettingsNotificationOptionId) => optionId === 'browserPush'

const resolveBrowserNotificationPermission = (): NotificationPermission => {
  if (!('Notification' in window)) return 'denied'

  return Notification.permission
}

const toNotificationPermission = (permissionState: PermissionState): NotificationPermission =>
  permissionState === 'prompt' ? 'default' : permissionState

export const useNotificationSettings = () => {
  const { settings, mutate } = useSettings()
  const { isMobileOnly } = useScreen()
  const browserNotificationPermission = ref<NotificationPermission>(resolveBrowserNotificationPermission())
  const browserNotificationPermissionStatus = shallowRef<PermissionStatus | null>(null)
  const notificationVisibility = computed(getClientPlatform)
  const isBrowserNotificationGranted = computed(() => browserNotificationPermission.value === 'granted')
  const sections = ref(SETTINGS_NOTIFICATION_SECTIONS)
  const optionsBySection = computed(() => {
    const visibility = notificationVisibility.value

    return Object.fromEntries(
      sections.value.map(({ id }) => [
        id,
        SETTINGS_NOTIFICATION_OPTIONS[id].filter(
          (option) =>
            (!option.visibility || option.visibility === visibility) && (!option.mobileOnly || isMobileOnly.value)
        )
      ])
    )
  })

  const syncBrowserNotificationPermission = () => {
    const permissionStatus = browserNotificationPermissionStatus.value

    browserNotificationPermission.value = permissionStatus
      ? toNotificationPermission(permissionStatus.state)
      : resolveBrowserNotificationPermission()
  }

  const watchBrowserNotificationPermission = async () => {
    if (!('permissions' in navigator)) return

    try {
      const permissionStatus = await navigator.permissions.query(NOTIFICATION_PERMISSION_QUERY)

      browserNotificationPermissionStatus.value = permissionStatus
      permissionStatus.addEventListener('change', syncBrowserNotificationPermission)
      syncBrowserNotificationPermission()
    } catch (error) {
      void error
    }
  }

  const requestBrowserNotificationPermission = async () => {
    if (!('Notification' in window)) return false

    browserNotificationPermission.value = await Notification.requestPermission()

    return isBrowserNotificationGranted.value
  }

  const getValue = (groupId: NotificationSettingGroup, optionId: SettingsNotificationOptionId) => {
    if (optionId === 'enabled') return settings.value.notifications.enabled

    const value = settings.value.notifications[groupId][optionId]

    if (!isBrowserPushOption(optionId)) return value

    return value && isBrowserNotificationGranted.value
  }

  const isDisabled = (_groupId: NotificationSettingGroup, optionId: SettingsNotificationOptionId) => {
    return isBrowserPushOption(optionId) && browserNotificationPermission.value === 'denied'
  }

  const setAll = (value: boolean) => {
    return mutate((data) => {
      data.notifications.enabled = value

      NOTIFICATION_GROUP_IDS.forEach((groupId) => {
        NOTIFICATION_CHANNEL_IDS.forEach((channelId) => {
          data.notifications[groupId][channelId] =
            channelId === 'browserPush' ? value && isBrowserNotificationGranted.value : value
        })
      })
    })
  }

  const setGroup = (groupId: NotificationSettingGroup, channelId: NotificationSettingKey, value: boolean) => {
    return mutate((data) => {
      data.notifications[groupId][channelId] = value

      if (groupId !== 'general') return

      NOTIFICATION_GROUP_IDS.filter((notificationGroupId) => notificationGroupId !== 'general').forEach(
        (notificationGroupId) => {
          data.notifications[notificationGroupId][channelId] = value
        }
      )
    })
  }

  const setBrowserPushValue = async (groupId: NotificationSettingGroup, value: boolean) => {
    const nextValue =
      value && !isBrowserNotificationGranted.value ? await requestBrowserNotificationPermission() : value

    return setGroup(groupId, 'browserPush', nextValue)
  }

  const setValue = async (
    groupId: NotificationSettingGroup,
    optionId: SettingsNotificationOptionId,
    value: boolean
  ) => {
    if (optionId === 'enabled') return setAll(value)
    if (isBrowserPushOption(optionId)) return setBrowserPushValue(groupId, value)

    return setGroup(groupId, optionId, value)
  }

  onMounted(() => {
    void watchBrowserNotificationPermission()
  })

  onBeforeUnmount(() => {
    browserNotificationPermissionStatus.value?.removeEventListener('change', syncBrowserNotificationPermission)
  })

  return {
    sections,
    optionsBySection,
    getValue,
    isDisabled,
    setValue
  }
}
