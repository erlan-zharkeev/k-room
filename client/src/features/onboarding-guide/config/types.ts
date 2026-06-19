import type { INmorphGuideStepItem } from '@nmorph/nmorph-ui-kit'

import type { I18nKey } from 'src/shared/lib'

export type OnboardingGuideStepName = 'navigation' | 'topBar' | 'contentNavigation' | 'content'

export interface OnboardingGuideStepConfig {
  name: OnboardingGuideStepName
  title: I18nKey
  text: I18nKey
  position: INmorphGuideStepItem['position']
  order: number
}

export interface OnboardingGuideStepItem extends INmorphGuideStepItem {
  name: OnboardingGuideStepName
}

export interface OnboardingGuideTargetProps {
  name: OnboardingGuideStepName
  position?: INmorphGuideStepItem['position']
}
