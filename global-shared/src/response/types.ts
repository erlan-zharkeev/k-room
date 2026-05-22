import type { UserDataType } from '../user/types'

export interface IConfirmEmailResponse {
  email: string
}

export type LoginResponseType = UserDataType

export type SignInWithProviderResponseType = UserDataType

export type GetUserDataResponseType = UserDataType

export interface ISendConfirmationLinkResponse {
  email: string
  nextRequestTime: number
  attempts: number
}

export interface ISendPasswordRecoveryCodeResponse {
  nextTimeRequest: number
  debugCode?: string
}

export interface ISendChangeEmailCodeResponse {
  nextTimeRequest: number
  debugCode?: string
}

export interface IValidatePasswordRecoveryCodeResponse {
  query: string
}

export interface IValidateChangeEmailCodeResponse {
  email: string
}
