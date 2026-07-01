import { defineAsyncComponent } from 'vue'

export const SETTINGS_CONTENT_COMPONENTS = {
  account: defineAsyncComponent(() => import('../../ui/content/account/SettingsAccountContent.vue')),
  appearance: defineAsyncComponent(() => import('../../ui/content/appearance/SettingsAppearanceContent.vue')),
  language: defineAsyncComponent(() => import('../../ui/content/localization/SettingsLocalizationContent.vue')),
  notifications: defineAsyncComponent(() => import('../../ui/content/SettingsNotificationsContent.vue')),
  devices: defineAsyncComponent(() => import('../../ui/content/devices/SettingsDevicesContent.vue')),
  storage: defineAsyncComponent(() => import('../../ui/content/storage/SettingsStorageContent.vue')),
  faq: defineAsyncComponent(() => import('../../ui/content/SettingsFaqContent.vue')),
  roadmap: defineAsyncComponent(() => import('../../ui/content/SettingsRoadmapContent.vue'))
} as const
