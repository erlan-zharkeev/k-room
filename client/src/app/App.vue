<script setup lang="ts">
import { NmorphNotificationProvider } from '@nmorph/nmorph-ui-kit'

import { useAppToast } from 'src/shared/lib/notification'

import UnsupportedResolutionGuard from './guards/UnsupportedResolutionGuard.vue'
import { useLanguageProvider } from './providers/use-language-provider'
import { useThemeProvider } from './providers/use-theme-provider'
import { useUserInteractionProvider } from './providers/use-user-interaction-provider'

useLanguageProvider()
useThemeProvider()
useUserInteractionProvider()
const { systemToasts, messageToasts } = useAppToast()
</script>

<template>
  <div class="app">
    <UnsupportedResolutionGuard />
    <NmorphNotificationProvider :notifications="systemToasts" placement="top-center" />
    <NmorphNotificationProvider :notifications="messageToasts" placement="top-right" />
    <RouterView />
  </div>
</template>

<style lang="scss">
.app {
  height: 100%;
  min-height: 0;
}
</style>
