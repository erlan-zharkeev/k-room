<script setup lang="ts">
import { NmorphText, NmorphButton } from '@nmorph/nmorph-ui-kit'
import { ROUTE_NAMES } from 'global-shared'
import { RouterLink } from 'vue-router'

import { ERROR_PAGE_I18N } from '../config/i18n'
</script>

<template>
  <div class="error-page">
    <NmorphText as="h3" variant="title" weight="bold">{{ $t(ERROR_PAGE_I18N.title) }}</NmorphText>
    <NmorphText>{{ $t(ERROR_PAGE_I18N.description) }}</NmorphText>

    <RouterLink custom :to="ROUTE_NAMES.app" v-slot="{ navigate }">
      <NmorphButton :text="$t(ERROR_PAGE_I18N.toMain)" @click="navigate" />
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  display: grid;
  gap: 8px;
}
</style>
