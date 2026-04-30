import type { ICaptchaTokenPayload } from '../security/types'
import type { ProviderType } from '../shared/types'

export interface IAuthLoginPayload extends ICaptchaTokenPayload {
  login: string
  password: string
}

export interface IAuthRegistrationPayload extends ICaptchaTokenPayload {
  nickname: string
  email: string
  password: string
}

export interface ISendConfirmationLinkPayload extends ICaptchaTokenPayload {
  email: string
}

export interface ISignInWithProviderPayload {
  nickname: string
  email: string
  provider: ProviderType
  avatar?: string
}
