export const SECURITY_ACTION = {
  login: 'login',
  registration: 'registration',
  sendConfirmationLink: 'send-confirmation-link',
  sendChangeEmailCode: 'send-change-email-code',
  validateChangeEmailCode: 'validate-change-email-code',
  sendPasswordRecoveryCode: 'send-password-recovery-code',
  validatePasswordRecoveryCode: 'validate-password-recovery-code'
} as const

export const PROTECTED_ACTION_REASON = {
  captchaRequired: 'captcha-required',
  rateLimited: 'rate-limited',
  temporarilyBlocked: 'temporarily-blocked'
} as const
