import type { IFrontendUserData } from '../user/types'

export interface IConfirmEmailResponse {
  email: string
}

export type LoginResponseType = IFrontendUserData

export type SignInWithProviderResponseType = IFrontendUserData

export type GetUserDataResponseType = IFrontendUserData

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
