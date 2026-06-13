<script setup lang="ts">
import { NmorphNotificationProvider } from '@nmorph/nmorph-ui-kit'
import { RouterView } from 'vue-router'

import UnsupportedResolutionGuard from './guards/UnsupportedResolutionGuard.vue'
import { useDexieCacheTrimProvider } from './providers/use-dexie-cache-trim-provider'
import { useLanguageProvider } from './providers/use-language-provider'
import { useMediaDevicePermissionProvider } from './providers/use-media-device-permission-provider'
import { useThemeProvider } from './providers/use-theme-provider'
import { useToastProvider } from './providers/use-toast-provider'
import { useUserInteractionProvider } from './providers/use-user-interaction-provider'

useLanguageProvider()
useThemeProvider()
useUserInteractionProvider()
useMediaDevicePermissionProvider()
useDexieCacheTrimProvider()

const { toasts } = useToastProvider()
</script>

<template>
  <UnsupportedResolutionGuard />
  <NmorphNotificationProvider :notifications="toasts" placement="top-center" />
  <RouterView v-slot="{ Component, route }">
    <Transition name="app-root-route-motion" mode="out-in">
      <component :is="Component" :key="route.matched[0]?.path ?? route.fullPath" />
    </Transition>
  </RouterView>
</template>
