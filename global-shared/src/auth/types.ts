import type { ProviderType } from '../shared/types'

export interface IAuthLoginPayload {
  login: string
  password: string
}

export interface IAuthRegistrationPayload {
  nickname: string
  email: string
  password: string
}

export interface ISignInWithProviderPayload {
  nickname: string
  email: string
  provider: ProviderType
  avatar?: string
}
