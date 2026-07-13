<script setup lang="ts">
import { NmorphNotificationProvider } from '@nmorph/nmorph-ui-kit'
import { RouterView } from 'vue-router'

import { UpdateNativeDesktopDialog } from 'src/features/update-native-desktop'
import { useMediaDevicePermission } from 'src/shared/lib'

import UnsupportedResolutionGuard from './guards/UnsupportedResolutionGuard.vue'
import { useDexieCacheTrimProvider } from './providers/use-dexie-cache-trim-provider.model'
import { useLanguageProvider } from './providers/use-language-provider.model'
import { useThemeProvider } from './providers/use-theme-provider.model'
import { useToastProvider } from './providers/use-toast-provider.model'
import { useUserInteractionProvider } from './providers/use-user-interaction-provider.model'
import { useAppRootWallpaperBackground } from './use-app-root-wallpaper-background.model'

useLanguageProvider()
useThemeProvider()
useUserInteractionProvider()
useMediaDevicePermission()
useDexieCacheTrimProvider()

const { toasts } = useToastProvider()
const { appRootWallpaperBackgroundStyle, showAppRootWallpaperBackground } = useAppRootWallpaperBackground()
</script>

<template>
  <UnsupportedResolutionGuard />
  <UpdateNativeDesktopDialog />
  <NmorphNotificationProvider :notifications="toasts" placement="top-center" />
  <div
    class="app-root-route"
    :class="{ 'app-root-route--wallpaper': showAppRootWallpaperBackground }"
    :style="appRootWallpaperBackgroundStyle"
  >
    <div class="app-root-route__content">
      <RouterView v-slot="{ Component, route }">
        <Transition name="app-root-route-motion" mode="out-in">
          <component :is="Component" :key="route.matched[0]?.path ?? route.fullPath" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-root-route {
  isolation: isolate;
  position: relative;

  overflow: hidden;

  height: 100%;
  min-height: 0;

  background: transparent;
}

.app-root-route--wallpaper {
  background: var(--nmorph-main-color);
}

.app-root-route::before {
  pointer-events: none;
  content: '';

  position: fixed;
  z-index: 0;
  inset: 50% auto auto 50%;
  transform-origin: center;
  transform: var(--app-root-wallpaper-transform);

  display: none;

  width: 240vmax;
  height: 240vmax;

  opacity: 0.72;
  background: var(--app-root-wallpaper) center / 280px auto repeat;
  filter: var(--app-root-wallpaper-brightness) saturate(0.9);
}

.app-root-route::after {
  pointer-events: none;
  content: '';

  position: fixed;
  z-index: 0;
  inset: 0;

  display: none;

  background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--nmorph-dark-shade-color) 50%, transparent),
      color-mix(in srgb, var(--nmorph-main-color) 28%, transparent)
    ),
    radial-gradient(
      circle at 20% 20%,
      color-mix(in srgb, var(--nmorph-light-shade-color) 14%, transparent),
      transparent 34%
    ),
    radial-gradient(
      circle at 80% 72%,
      color-mix(in srgb, var(--nmorph-dark-shade-color) 22%, transparent),
      transparent 40%
    );
}

.app-root-route--wallpaper::before,
.app-root-route--wallpaper::after {
  display: block;
}

.app-root-route__content {
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 0;
}
</style>
