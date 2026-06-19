export type SecurityAction =
  | 'login'
  | 'registration'
  | 'send-confirmation-link'
  | 'send-change-email-code'
  | 'validate-change-email-code'
  | 'send-password-recovery-code'
  | 'validate-password-recovery-code'

export type ProtectedActionReason = 'captcha-required' | 'rate-limited' | 'temporarily-blocked'

export interface CaptchaTokenPayload {
  captchaToken?: string
}

export interface ProtectedActionResponsePayload {
  action: SecurityAction
  reason: ProtectedActionReason
  captchaAvailable: boolean
  nextTryAt?: number
}
