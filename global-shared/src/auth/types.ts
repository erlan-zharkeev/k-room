import type { CaptchaTokenPayload } from '../security/types'
import type { Provider } from '../shared/types'

export interface AuthLoginPayload extends CaptchaTokenPayload {
  login: string
  password: string
}

export interface AuthRegistrationPayload extends CaptchaTokenPayload {
  nickname: string
  email: string
  password: string
}

export interface SendConfirmationLinkPayload extends CaptchaTokenPayload {
  email: string
}

export interface SignInWithProviderPayload {
  nickname: string
  email: string
  provider: Provider
  avatar?: string
}
