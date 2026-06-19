import { computed } from 'vue'

import type { OnboardingGuideTargetProps } from '../config/types'
import { useOnboardingGuide } from '../model/use-onboarding-guide.model'

export const useOnboardingGuideTarget = (props: OnboardingGuideTargetProps) => {
  const { activeGuideStep, guideStepMap, isGuideVisible } = useOnboardingGuide()
  const guideStep = computed(() => guideStepMap.value[props.name])
  const isGuideStepActive = computed(() => isGuideVisible.value && activeGuideStep.value === props.name)

  return {
    guideStep,
    isGuideStepActive
  }
}
