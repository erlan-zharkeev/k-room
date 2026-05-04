<script setup lang="ts">
import { Toast } from 'primevue'

import UnsupportedResolutionGuard from './guards/UnsupportedResolutionGuard.vue'
import { useLanguageProvider } from './providers/use-language-provider'
import { useThemeProvider } from './providers/use-theme-provider'
import { useUserInteractionProvider } from './providers/use-user-interaction-provider'

useLanguageProvider()
useThemeProvider()
useUserInteractionProvider()
</script>

<template>
  <div class="app">
    <Toast />
    <RouterView />
    <UnsupportedResolutionGuard />
  </div>
</template>

<style lang="scss">
.app {
  height: 100%;
  min-height: 0;
}
</style>
