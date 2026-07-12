<script setup lang="ts">
import { NmorphGuide } from '@nmorph/nmorph-ui-kit'

import { useOnboardingGuide } from '../model/use-onboarding-guide.model'

const { activeGuideStep, completeGuide, guideLabels, isGuideVisible } = useOnboardingGuide()
</script>

<template>
  <NmorphGuide
    v-model="isGuideVisible"
    v-model:active-step="activeGuideStep"
    class="onboarding-guide"
    :back-text="guideLabels.back"
    :close-text="guideLabels.skip"
    :finish-text="guideLabels.finish"
    max-width="calc(100vw - 32px)"
    :next-text="guideLabels.next"
    :show-close="true"
    :show-progress="true"
    target-outline-color="success"
    target-outline-offset="4px"
    :width="320"
    :z-index="30"
    @close="completeGuide"
    @finish="completeGuide"
  >
    <slot />
  </NmorphGuide>
</template>

<style lang="scss" scoped>
.onboarding-guide {
  height: 100%;
  min-height: 0;
}
</style>
