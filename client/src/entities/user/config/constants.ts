import { USER_DEFAULT_ONBOARDING, type UserData } from 'global-shared'

export const INITIAL_USER_STORE: UserData = {
  avatarId: null,
  id: '',
  role: 'user',
  email: '',
  provider: 'app',
  nickname: '',
  onboarding: USER_DEFAULT_ONBOARDING
}
