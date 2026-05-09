import type { NotificationSettingGroupType, NotificationSettingKeyType } from 'src/entities/setting'

import { SETTINGS_PAGE_NOTIFICATIONS_I18N } from '../i18n/notifications.i18n'
import type { ISettingsNotificationOption, ISettingsNotificationSection } from '../types/notifications.types'

export const NOTIFICATION_GROUP_IDS: NotificationSettingGroupType[] = ['general', 'messages', 'calls']

export const NOTIFICATION_CHANNEL_IDS: NotificationSettingKeyType[] = [
  'toast',
  'sound',
  'vibration',
  'browserPush',
  'nativePush'
]

export const SETTINGS_NOTIFICATION_SECTIONS: ISettingsNotificationSection[] = [
  {
    id: 'general',
    title: SETTINGS_PAGE_NOTIFICATIONS_I18N.general
  },
  {
    id: 'messages',
    title: SETTINGS_PAGE_NOTIFICATIONS_I18N.messages
  },
  {
    id: 'calls',
    title: SETTINGS_PAGE_NOTIFICATIONS_I18N.calls
  }
]

export const SETTINGS_NOTIFICATION_OPTIONS: Record<string, ISettingsNotificationOption[]> = {
  general: [
    {
      id: 'enabled',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.allNotifications,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.allNotificationsDescription
    },
    {
      id: 'toast',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.allToasts,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.allToastsDescription
    },
    {
      id: 'sound',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.allSounds,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.allSoundsDescription
    },
    {
      id: 'vibration',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.allVibration,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.allVibrationDescription,
      mobileOnly: true
    },
    {
      id: 'browserPush',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.allBrowserPush,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.allBrowserPushDescription,
      visibility: 'browser'
    },
    {
      id: 'nativePush',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.allNativePush,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.allNativePushDescription,
      visibility: 'native'
    }
  ],
  messages: [
    {
      id: 'toast',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageToasts,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageToastsDescription
    },
    {
      id: 'sound',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageSound,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageSoundDescription
    },
    {
      id: 'vibration',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageVibration,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageVibrationDescription,
      mobileOnly: true
    },
    {
      id: 'browserPush',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageBrowserPush,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageBrowserPushDescription,
      visibility: 'browser'
    },
    {
      id: 'nativePush',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageNativePush,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.messageNativePushDescription,
      visibility: 'native'
    }
  ],
  calls: [
    {
      id: 'toast',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.callToasts,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.callToastsDescription
    },
    {
      id: 'sound',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.callSound,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.callSoundDescription
    },
    {
      id: 'vibration',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.callVibration,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.callVibrationDescription,
      mobileOnly: true
    },
    {
      id: 'browserPush',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.callBrowserPush,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.callBrowserPushDescription,
      visibility: 'browser'
    },
    {
      id: 'nativePush',
      label: SETTINGS_PAGE_NOTIFICATIONS_I18N.callNativePush,
      description: SETTINGS_PAGE_NOTIFICATIONS_I18N.callNativePushDescription,
      visibility: 'native'
    }
  ]
}
