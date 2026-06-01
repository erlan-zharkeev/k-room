import type { CodeRequestResponse } from 'global-shared'

export interface CodeElement {
  value: string
  expiresAt: number
}

export interface CodeMethod {
  query: CodeElement
  email: CodeElement
  sms: CodeElement
}

export interface CodePurpose {
  passwordRecovery: CodeMethod
}

export interface CodeSchema {
  _id?: string
  codes: CodePurpose
  nextRequestPossibleAt: number
}

export interface SendPasswordRecoveryCodeResult extends CodeRequestResponse {
  tooManyRequests: boolean
}

export interface SendChangeEmailCodeResult extends CodeRequestResponse {
  tooManyRequests: boolean
}
