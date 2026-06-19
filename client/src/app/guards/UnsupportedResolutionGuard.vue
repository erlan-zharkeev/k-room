<script setup lang="ts">
import { useI18n } from 'src/shared/lib'
import { AppHeader, AppText } from 'src/shared/ui'

import { APP_I18N } from '../config/i18n'

import { useUnsupportedResolutionGuard } from './use-unsupported-resolution-guard.model'

const { t } = useI18n()
const { isUnsupportedResolution } = useUnsupportedResolutionGuard()
</script>

<template>
  <div v-if="isUnsupportedResolution" class="unsupported-resolution-guard" role="alert">
    <AppHeader tag="h1" size="xlarge" alignment="center" :text="t(APP_I18N.unsupportedResolutionTitle)" />
    <AppText size="large" alignment="center" :text="t(APP_I18N.unsupportedResolutionDescription)" />
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
