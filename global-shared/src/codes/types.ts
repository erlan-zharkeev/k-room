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

export interface EmailCodeRequestPayload extends CaptchaTokenPayload {
  email: string
}

export interface EmailCodeValidationPayload extends EmailCodeRequestPayload {
  code: string
}
