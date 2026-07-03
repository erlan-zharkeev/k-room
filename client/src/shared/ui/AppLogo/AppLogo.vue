<script setup lang="ts">
import { NmorphIcon } from '@nmorph/nmorph-ui-kit'
import { RouterLink } from 'vue-router'

import { useAppLogo } from './use-app-logo.model'

const { appName } = __CLIENT_ENV_DATA__
const { defaultSrc, to } = useAppLogo()
</script>

<template>
  <RouterLink :to="to" class="app-logo" :aria-label="appName">
    <NmorphIcon width="48px">
      <img :src="defaultSrc" :alt="appName" />
    </NmorphIcon>
  </RouterLink>
</template>

<style lang="scss" scoped>
.app-logo {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
