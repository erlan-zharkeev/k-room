import type { CaptchaTokenPayload } from '../security/types'

export interface EmailCodeRequestPayload extends CaptchaTokenPayload {
  email: string
}

export interface EmailCodeValidationPayload extends EmailCodeRequestPayload {
  code: string
}
