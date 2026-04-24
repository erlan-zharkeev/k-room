<script setup lang="ts">
import Toast from 'primevue/toast'

import { useClientData } from './lib/use-client-data'

const { initializeClientData } = useClientData()

initializeClientData()
</script>

<template>
  <Toast />
  <RouterView />
</template>
