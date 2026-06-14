import type { INmorphGuideStepItem } from '@nmorph/nmorph-ui-kit'
import type { LocalizedText } from 'global-shared'

export type OnboardingGuideStepName = 'navigation' | 'topBar' | 'contentNavigation' | 'content'

export interface OnboardingGuideStepConfig {
  name: OnboardingGuideStepName
  title: LocalizedText<string>
  text: LocalizedText<string>
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
