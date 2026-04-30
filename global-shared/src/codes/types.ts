import type { ICaptchaTokenPayload } from '../security/types'

export interface ICodes {
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

export interface ISendPasswordRecoveryCodePayload extends ICaptchaTokenPayload {
  email: string
}

export interface ICodeValidationPayload extends ICaptchaTokenPayload {
  email: string
  code: string
}
