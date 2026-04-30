import type { PROTECTED_ACTION_REASON, SECURITY_ACTION } from './constants'

export type SecurityActionType = (typeof SECURITY_ACTION)[keyof typeof SECURITY_ACTION]

export type ProtectedActionReasonType = (typeof PROTECTED_ACTION_REASON)[keyof typeof PROTECTED_ACTION_REASON]

export interface ICaptchaTokenPayload {
  captchaToken?: string
}

export interface IProtectedActionResponsePayload {
  action: SecurityActionType
  reason: ProtectedActionReasonType
  captchaAvailable: boolean
  nextTryAt?: number
}
