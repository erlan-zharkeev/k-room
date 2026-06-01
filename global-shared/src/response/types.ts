export interface ConfirmEmailResponse {
  email: string
}

export interface RequestCooldownResponse {
  nextRequestTime: number
}

export interface SendConfirmationLinkResponse extends RequestCooldownResponse {
  email: string
  attempts: number
}

export interface CodeRequestResponse extends RequestCooldownResponse {
  debugCode?: string
}

export interface ValidatePasswordRecoveryCodeResponse {
  query: string
}

export interface ValidateChangeEmailCodeResponse {
  email: string
}
