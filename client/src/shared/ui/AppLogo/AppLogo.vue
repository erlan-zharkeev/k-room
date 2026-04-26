<script setup lang="ts">
import { ROUTE_NAMES } from 'global-shared'
import { Image } from 'primevue'
import { RouterLink } from 'vue-router'

import { CLIENT_ENV } from 'src/shared/config'

import { APP_LOGO_DEFAULT_SRC } from './constants'
</script>

<template>
  <RouterLink :to="ROUTE_NAMES.app" class="app-logo" :aria-label="CLIENT_ENV.appName">
    <Image :src="APP_LOGO_DEFAULT_SRC" :width="40" :alt="CLIENT_ENV.appName" image-class="app-logo__image" />
  </RouterLink>
</template>

<style>
.app-logo {
  display: inline-grid;
  place-items: center;
  line-height: 0;
}
</style>
