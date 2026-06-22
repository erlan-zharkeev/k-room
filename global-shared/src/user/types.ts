import type { MediaId } from '../media/types'
import type { Provider } from '../shared/types'

import { type USER_ROLES } from './constants'

export type UserRole = (typeof USER_ROLES)[number]

export type UserOnboardingData = {
  welcomeCompleted: boolean
  guideCompleted: boolean
}

export type UserPreview = {
  avatarId: MediaId
  id: string
  nickname: string
}

export type UserData = UserPreview & {
  role: UserRole
  email: string
  provider: Provider
  onboarding: UserOnboardingData
}
