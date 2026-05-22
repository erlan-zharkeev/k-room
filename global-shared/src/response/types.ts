import type { UserData } from '../user/types'

export interface ConfirmEmailResponse {
  email: string
}

export type LoginResponse = UserData

export type SignInWithProviderResponse = UserData

export type GetUserDataResponse = UserData

export interface SendConfirmationLinkResponse {
  email: string
  nextRequestTime: number
  attempts: number
}

export interface SendPasswordRecoveryCodeResponse {
  nextTimeRequest: number
  debugCode?: string
}

export interface SendChangeEmailCodeResponse {
  nextTimeRequest: number
  debugCode?: string
}

export interface ValidatePasswordRecoveryCodeResponse {
  query: string
}

export interface ValidateChangeEmailCodeResponse {
  email: string
}
