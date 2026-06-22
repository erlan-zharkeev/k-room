import { computed } from 'vue'

import type { OnboardingGuideTargetProps } from '../config/types'
import { useOnboardingGuide } from '../model/use-onboarding-guide.model'

export const useOnboardingGuideTarget = (props: OnboardingGuideTargetProps) => {
  const { guideStepMap } = useOnboardingGuide()
  const guideStep = computed(() => guideStepMap.value[props.name])

  return {
    guideStep
  }
}
