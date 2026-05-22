import type { CaptchaTokenPayload } from '../security/types'

export interface Codes {
  passwordRecovery: {
    query: {
      value: string
      expiresIn: string
    }
    email: string
    sms: string
  }
  nextRequestPossibleAt: string
}

export interface SendPasswordRecoveryCodePayload extends CaptchaTokenPayload {
  email: string
}

export interface SendChangeEmailCodePayload extends CaptchaTokenPayload {
  email: string
}

export interface CodeValidationPayload extends CaptchaTokenPayload {
  email: string
  code: string
}

export interface ValidateChangeEmailCodePayload extends CaptchaTokenPayload {
  email: string
  code: string
}
