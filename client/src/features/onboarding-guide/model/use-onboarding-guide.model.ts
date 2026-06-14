import { computed, ref } from 'vue'

import { useI18n } from 'src/shared/lib'

import { ONBOARDING_GUIDE_STEP, ONBOARDING_GUIDE_STEP_CONFIGS } from '../config/constants'
import { ONBOARDING_GUIDE_I18N } from '../config/i18n'
import type { OnboardingGuideStepItem, OnboardingGuideStepName } from '../config/types'

const isGuideVisible = ref(false)
const activeGuideStep = ref<OnboardingGuideStepName>(ONBOARDING_GUIDE_STEP.navigation)

export const useOnboardingGuide = () => {
  const { t } = useI18n()

  const guideStepMap = computed(() =>
    ONBOARDING_GUIDE_STEP_CONFIGS.reduce((acc, step) => {
      acc[step.name] = {
        name: step.name,
        title: t(step.title),
        text: t(step.text),
        position: step.position,
        order: step.order
      }

      return acc
    }, {} as Record<OnboardingGuideStepName, OnboardingGuideStepItem>)
  )

  const guideLabels = computed(() => ({
    back: t(ONBOARDING_GUIDE_I18N.back),
    next: t(ONBOARDING_GUIDE_I18N.next),
    finish: t(ONBOARDING_GUIDE_I18N.finish),
    skip: t(ONBOARDING_GUIDE_I18N.skip)
  }))

  const openGuide = () => {
    activeGuideStep.value = ONBOARDING_GUIDE_STEP.navigation
    isGuideVisible.value = true
  }

  const completeGuide = () => {
    isGuideVisible.value = false
  }

  return {
    activeGuideStep,
    completeGuide,
    guideLabels,
    guideStepMap,
    isGuideVisible,
    openGuide
  }
}
