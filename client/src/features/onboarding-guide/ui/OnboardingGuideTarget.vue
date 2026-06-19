<script setup lang="ts">
import { NmorphGuideStep } from '@nmorph/nmorph-ui-kit'

import type { OnboardingGuideTargetProps } from '../config/types'

import { useOnboardingGuideTarget } from './use-onboarding-guide-target.model'

const props = defineProps<OnboardingGuideTargetProps>()
const { guideStep, isGuideStepActive } = useOnboardingGuideTarget(props)
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
