<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { useInfoNotification } from 'src/entities/info-notification'
import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import {
  MAIN_PAGE_I18N,
  MAIN_PAGE_NAV_ITEMS,
  MAIN_PAGE_ROUTES,
  MAIN_PAGE_SETTINGS_ITEMS,
  MAIN_PAGE_WALLPAPER_ITEMS,
  useLogout,
  useMainMonitors,
  useMessage
} from 'src/pages/main'
import { socketStatus } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'
import { getSystemTheme, useI18n } from 'src/shared/lib'
import { MainLeftBar } from 'src/widgets/main-left-bar'
import { MainTopBar } from 'src/widgets/main-top-bar'

const route = useRoute()
const { t } = useI18n()
const { settings } = useSettings()
const { user } = useUser()
const { infoNotificationList } = useInfoNotification()
const { messages } = useMessage()
const { isLogoutLoading, logout } = useLogout()

useMainMonitors()

const selectedSettingsId = ref('account')
const systemTheme = ref(getSystemTheme())
const systemThemeQuery = window.matchMedia?.('(prefers-color-scheme: light)')
const unreadInfoNotificationQuantity = computed(
  () => infoNotificationList.value.filter(({ status }) => status === 'unread').length
)
const unreadMessagesQuantity = computed(
  () => messages.value.filter(({ isSelf, status }) => !isSelf && status === 'delivered').length
)

const activeNavItem = computed(() => {
  const item = MAIN_PAGE_NAV_ITEMS.find(({ path }) => path === route.path)

  if (item) return item

  if (route.path.startsWith(MAIN_PAGE_ROUTES.settings)) {
    return MAIN_PAGE_NAV_ITEMS.find(({ id }) => id === 'settings') ?? MAIN_PAGE_NAV_ITEMS[0]
  }

  return MAIN_PAGE_NAV_ITEMS[0]
})

const connectionStatus = computed(() => {
  if (socketStatus.isReconnecting.value) return MAIN_PAGE_I18N.reconnecting

  return socketStatus.isConnected.value ? MAIN_PAGE_I18N.connected : MAIN_PAGE_I18N.disconnected
})

const userAvatarId = computed(() => (user.value.id ? `avatar.${user.value.id}` : ''))

const defaultWallpaper = computed(() => {
  const item = MAIN_PAGE_WALLPAPER_ITEMS[0]
  const theme = settings.value.theme === 'system' ? systemTheme.value : settings.value.theme

  return theme === 'light' ? item.lightSrc : item.darkSrc
})

const selectedWallpaper = computed(() => {
  if (settings.value.wallpaper === 'custom') {
    return settings.value.customWallpaperDataUrl
  }

  return defaultWallpaper.value
})

const isDefaultWallpaperVisible = computed(
  () => settings.value.showWallpaper && settings.value.wallpaper === 'default' && Boolean(selectedWallpaper.value)
)

const widgetWallpaperStyle = computed(() => {
  if (!settings.value.showWallpaper || !selectedWallpaper.value) return undefined

  if (settings.value.wallpaper === 'default') {
    return {
      '--main-page-widget-wallpaper': `url(${selectedWallpaper.value})`,
      '--main-layout-wallpaper-pseudo-display': isDefaultWallpaperVisible.value ? 'block' : 'none'
    }
  }

  return {
    backgroundImage: `linear-gradient(var(--p-app-widget-background, var(--p-content-background)), var(--p-app-widget-background, var(--p-content-background))), url(${selectedWallpaper.value})`
  }
})

const isSettingsId = (settingsId: unknown): settingsId is (typeof MAIN_PAGE_SETTINGS_ITEMS)[number]['id'] =>
  typeof settingsId === 'string' && MAIN_PAGE_SETTINGS_ITEMS.some(({ id }) => id === settingsId)

const syncSelectedSettingsWithRoute = () => {
  const { settingsId } = route.params

  selectedSettingsId.value = isSettingsId(settingsId) ? settingsId : 'account'
}

const updateSystemTheme = () => {
  systemTheme.value = getSystemTheme()
}

watch(() => route.params.settingsId, syncSelectedSettingsWithRoute)

onMounted(() => {
  updateSystemTheme()
  syncSelectedSettingsWithRoute()
  systemThemeQuery?.addEventListener('change', updateSystemTheme)
})

onBeforeUnmount(() => {
  systemThemeQuery?.removeEventListener('change', updateSystemTheme)
})
</script>

<template>
  <main class="main-layout" :class="{ 'main-layout--wallpaper-hidden': !settings.showWallpaper }">
    <MainLeftBar
      :app-name="CLIENT_ENV.appName"
      :nav-items="MAIN_PAGE_NAV_ITEMS"
      :selected-settings-id="selectedSettingsId"
      :settings-route-prefix="MAIN_PAGE_ROUTES.settings"
      :unread-info-notifications="unreadInfoNotificationQuantity"
      :unread-messages="unreadMessagesQuantity"
      :wallpaper-style="widgetWallpaperStyle"
    />

    <section class="main-layout__workspace">
      <MainTopBar
        :image-alt="user.username || CLIENT_ENV.appName"
        :image-id="userAvatarId"
        :is-logout-loading="isLogoutLoading"
        :logout-label="t(MAIN_PAGE_I18N.logout)"
        :subtitle="`${t(activeNavItem.label)} · ${t(connectionStatus)}`"
        :title="user.username || CLIENT_ENV.appName"
        :wallpaper-style="widgetWallpaperStyle"
        @logout="logout"
      />

      <RouterView />
    </section>
  </main>
</template>

<style>
.main-layout {
  position: relative;

  overflow: hidden;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;

  height: 100dvh;
  padding: 12px;

  background: var(--p-app-main-bg);
}

.main-layout--wallpaper-hidden {
  background: var(--p-app-main-bg);
}

.main-layout__workspace {
  position: relative;
  z-index: 1;

  display: grid;
  grid-template-rows: 58px minmax(0, 1fr);
  gap: 12px;

  min-width: 0;
  min-height: 0;
}

@include screen-until('tablet') {
  .main-layout {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) 62px;
  }
}
</style>
