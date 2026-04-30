<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

import { useI18n } from 'src/shared/lib'
import { AppHeader, AppText } from 'src/shared/ui'

import { MIN_APP_VIEWPORT_HEIGHT_PX, MIN_APP_VIEWPORT_WIDTH_PX } from '../config/constants'
import { APP_I18N } from '../config/i18n'

const { t } = useI18n()
const { height, width } = useWindowSize()

const isUnsupportedResolution = computed(
  () => width.value < MIN_APP_VIEWPORT_WIDTH_PX || height.value < MIN_APP_VIEWPORT_HEIGHT_PX
)
</script>

<template>
  <div v-if="isUnsupportedResolution" class="unsupported-resolution-guard" role="alert">
    <AppHeader
      tag="h1"
      size="xlarge"
      align="center"
      :text="t(APP_I18N.unsupportedResolutionTitle)"
    />
    <AppText
      size="large"
      align="center"
      :text="t(APP_I18N.unsupportedResolutionDescription)"
    />
  </div>
</template>

<style lang="scss">
.unsupported-resolution-guard {
  position: fixed;
  z-index: 100000;
  inset: 0;

  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  justify-content: center;

  background: var(--p-content-background);
}
</style>
