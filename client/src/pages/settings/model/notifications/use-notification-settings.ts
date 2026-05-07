import { computed, ref } from 'vue'

import { useSettings } from 'src/entities/setting'
import { getClientPlatform, useScreen } from 'src/shared/lib'
import type { NotificationSettingGroupType, NotificationSettingKeyType } from 'src/shared/config'

import {
  NOTIFICATION_CHANNEL_IDS,
  NOTIFICATION_GROUP_IDS,
  SETTINGS_NOTIFICATION_OPTIONS,
  SETTINGS_NOTIFICATION_SECTIONS
} from '../../config/constants/notifications.constants'
import type { SettingsNotificationOptionIdType } from '../../config/types/notifications.types'

export const useNotificationSettings = () => {
  const { settings, mutate } = useSettings()
  const { isMobileOnly } = useScreen()
  const notificationVisibility = computed(getClientPlatform)
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

  const getValue = (groupId: NotificationSettingGroupType, optionId: SettingsNotificationOptionIdType) => {
    if (optionId === 'enabled') return settings.value.notifications.enabled

    return settings.value.notifications[groupId][optionId]
  }

  const setAll = (value: boolean) => {
    return mutate((data) => {
      data.notifications.enabled = value

      NOTIFICATION_GROUP_IDS.forEach((groupId) => {
        NOTIFICATION_CHANNEL_IDS.forEach((channelId) => {
          data.notifications[groupId][channelId] = value
        })
      })
    })
  }

  const setGroup = (
    groupId: NotificationSettingGroupType,
    channelId: NotificationSettingKeyType,
    value: boolean
  ) => {
    return mutate((data) => {
      data.notifications[groupId][channelId] = value

      if (groupId !== 'general') return

      data.notifications.messages[channelId] = value
      data.notifications.calls[channelId] = value
    })
  }

  const setValue = (
    groupId: NotificationSettingGroupType,
    optionId: SettingsNotificationOptionIdType,
    value: boolean
  ) => {
    if (optionId === 'enabled') return setAll(value)

    return setGroup(groupId, optionId, value)
  }

  return {
    sections,
    optionsBySection,
    getValue,
    setValue
  }
}
