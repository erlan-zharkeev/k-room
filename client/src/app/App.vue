<script setup lang="ts">
import { Toast } from 'primevue'
import UnsupportedResolutionGuard from './guards/UnsupportedResolutionGuard.vue'
import { useLanguageProvider } from './providers/use-language-provider'
import { useThemeProvider } from './providers/use-theme-provider'

useLanguageProvider()
useThemeProvider()
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
