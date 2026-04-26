<script setup lang="ts">
import { Toast } from 'primevue'

import { useLanguageProvider } from './providers/use-language-provider'
import { useThemeProvider } from './providers/use-theme-provider'

useLanguageProvider()
useThemeProvider()
</script>

<template>
  <Toast />
  <RouterView />
</template>
