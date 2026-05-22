import type { PROTECTED_ACTION_REASON, SECURITY_ACTION } from './constants'

export type SecurityAction = (typeof SECURITY_ACTION)[keyof typeof SECURITY_ACTION]

export type ProtectedActionReason = (typeof PROTECTED_ACTION_REASON)[keyof typeof PROTECTED_ACTION_REASON]

export interface CaptchaTokenPayload {
  captchaToken?: string
}

export interface ProtectedActionResponsePayload {
  action: SecurityAction
  reason: ProtectedActionReason
  captchaAvailable: boolean
  nextTryAt?: number
}
