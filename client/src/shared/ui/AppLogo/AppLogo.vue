<script setup lang="ts">
import {NmorphIcon} from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { RouterLink } from 'vue-router'

import { CLIENT_ENV } from 'src/shared/config'

import { APP_LOGO_DEFAULT_SRC } from './constants'
</script>

<template>
  <RouterLink :to="ROUTE_NAMES.app" class="app-logo" :aria-label="CLIENT_ENV.appName">
    <NmorphIcon width="48px">
      <img :src="APP_LOGO_DEFAULT_SRC" :alt="CLIENT_ENV.appName"/>
    </NmorphIcon>
  </RouterLink>
</template>

<style lang="scss">
.app-logo {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
