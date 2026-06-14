import { ONBOARDING_GUIDE_I18N } from './i18n'
import type { OnboardingGuideStepConfig } from './types'

export const ONBOARDING_GUIDE_STEP = {
  navigation: 'navigation',
  topBar: 'topBar',
  contentNavigation: 'contentNavigation',
  content: 'content'
} as const

export const ONBOARDING_GUIDE_STEP_CONFIGS: OnboardingGuideStepConfig[] = [
  {
    name: ONBOARDING_GUIDE_STEP.navigation,
    title: ONBOARDING_GUIDE_I18N.navigationTitle,
    text: ONBOARDING_GUIDE_I18N.navigationText,
    position: 'right',
    order: 1
  },
  {
    name: ONBOARDING_GUIDE_STEP.topBar,
    title: ONBOARDING_GUIDE_I18N.topBarTitle,
    text: ONBOARDING_GUIDE_I18N.topBarText,
    position: 'right',
    order: 2
  },
  {
    name: ONBOARDING_GUIDE_STEP.contentNavigation,
    title: ONBOARDING_GUIDE_I18N.contentNavigationTitle,
    text: ONBOARDING_GUIDE_I18N.contentNavigationText,
    position: 'right',
    order: 3
  },
  {
    name: ONBOARDING_GUIDE_STEP.content,
    title: ONBOARDING_GUIDE_I18N.contentTitle,
    text: ONBOARDING_GUIDE_I18N.contentText,
    position: 'left',
    order: 4
  }
]
