<script setup lang="ts">
import { NmorphButton } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { RouterLink } from 'vue-router'

import { AppText } from 'src/shared/ui'

import { ERROR_PAGE_I18N } from '../config/i18n'
</script>

<template>
  <div class="error-page">
    <AppText class="error-page__description" :text="$t(ERROR_PAGE_I18N.description)" />

    <RouterLink custom :to="ROUTE_NAMES.app" v-slot="{ navigate }">
      <NmorphButton :text="$t(ERROR_PAGE_I18N.toMain)" @click="navigate" />
    </RouterLink>
  </div>
</template>

<style lang="scss">
.error-page {
  display: flex;
  flex-direction: column;

  .error-page__description {
    margin-bottom: 8px;
  }
}
</style>
