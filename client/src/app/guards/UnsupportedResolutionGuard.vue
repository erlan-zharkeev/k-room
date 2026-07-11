<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

import { useI18n } from 'src/shared/lib'

import { UNSUPPORTED_RESOLUTION_GUARD_I18N } from './i18n'
import { useUnsupportedResolutionGuard } from './use-unsupported-resolution-guard.model'

const { t } = useI18n()
const { isUnsupportedResolution } = useUnsupportedResolutionGuard()
</script>

<template>
  <div v-if="isUnsupportedResolution" class="unsupported-resolution-guard" role="alert">
    <NmorphText as="h1" align="center" variant="display-large" weight="bold">{{
      t(UNSUPPORTED_RESOLUTION_GUARD_I18N.title)
    }}</NmorphText>
    <NmorphText align="center" variant="body-large">{{ t(UNSUPPORTED_RESOLUTION_GUARD_I18N.description) }}</NmorphText>
  </div>
</template>

<style lang="scss" scoped>
.unsupported-resolution-guard {
  position: fixed;
  z-index: 100000;
  inset: 0;

  @include flex-column-center;

  gap: 12px;

  background: var(--nmorph-main-color);
}
</style>
