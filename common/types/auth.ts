import { ProviderType } from './common'

export interface IAuthLoginPayload {
  email: string
  password: string
}

export interface IAuthRegistrationPayload {
  username: string
  email: string
  password: string
}

export interface ISignInWithProviderPayload {
  username: string
  email: string
  provider: ProviderType
  avatar?: string
}
