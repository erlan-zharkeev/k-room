<script setup lang="ts">
import { NmorphGuideStep } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import type { OnboardingGuideTargetProps } from '../config/types'
import { useOnboardingGuide } from '../model/use-onboarding-guide.model'

const props = defineProps<OnboardingGuideTargetProps>()
const { activeGuideStep, guideStepMap, isGuideVisible } = useOnboardingGuide()
const guideStep = computed(() => guideStepMap.value[props.name])
const isGuideStepActive = computed(() => isGuideVisible.value && activeGuideStep.value === props.name)
</script>

<template>
  <NmorphGuideStep
    class="onboarding-guide-target"
    :class="{ 'onboarding-guide-target--active': isGuideStepActive }"
    :name="guideStep.name"
    :order="guideStep.order"
    :position="props.position ?? guideStep.position"
    :text="guideStep.text"
    :title="guideStep.title"
  >
    <slot />
  </NmorphGuideStep>
</template>
