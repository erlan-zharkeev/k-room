<script setup lang="ts">
import { NmorphText } from '@nmorph/nmorph-ui-kit'

import { useI18n } from 'src/shared/lib'

import { APP_I18N } from '../config/i18n'

import { useUnsupportedResolutionGuard } from './use-unsupported-resolution-guard.model'

const { t } = useI18n()
const { isUnsupportedResolution } = useUnsupportedResolutionGuard()
</script>

<template>
  <div v-if="isUnsupportedResolution" class="unsupported-resolution-guard" role="alert">
    <NmorphText as="h1" align="center" variant="display-large" weight="bold">{{
      t(APP_I18N.unsupportedResolutionTitle)
    }}</NmorphText>
    <NmorphText align="center" variant="body-large">{{ t(APP_I18N.unsupportedResolutionDescription) }}</NmorphText>
  </div>
</template>

<style lang="scss">
.unsupported-resolution-guard {
  position: fixed;
  z-index: 100000;
  inset: 0;

  @include flex-column-center;

  gap: 12px;

  background: var(--nmorph-main-color);
}
</style>
