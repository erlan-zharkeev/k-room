import type { ISendChangeEmailCodeResponse, ISendPasswordRecoveryCodeResponse } from 'global-shared'

export interface ICodeElement {
  value: string
  expiresAt: number
}

export interface ICodeMethod {
  query: ICodeElement
  email: ICodeElement
  sms: ICodeElement
}

export interface ICodePurpose {
  passwordRecovery: ICodeMethod
}

export interface ICodeSchema {
  _id?: string
  codes: ICodePurpose
  nextRequestPossibleAt: number
}

export interface ISendPasswordRecoveryCodeResult extends ISendPasswordRecoveryCodeResponse {
  tooManyRequests: boolean
}

export interface ISendChangeEmailCodeResult extends ISendChangeEmailCodeResponse {
  tooManyRequests: boolean
}
