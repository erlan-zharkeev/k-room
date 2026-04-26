<script setup lang="ts">
import { Toast } from 'primevue'

import { useThemeProvider } from './providers/use-theme-provider'

useThemeProvider()
</script>

<template>
  <Toast />
  <RouterView />
</template>
