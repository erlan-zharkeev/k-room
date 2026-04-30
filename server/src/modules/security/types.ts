import type { ProtectedActionReasonType, SecurityActionType } from 'global-shared'

export interface IRedisMemoryValue {
  value: string
  expiresAt: number
}

export interface IProtectedActionDecision {
  action: SecurityActionType
  reason: ProtectedActionReasonType
  nextTryAt?: number
}

export interface ITurnstileVerificationResponse {
  success: boolean
  action?: string
  hostname?: string
  'error-codes'?: string[]
}
