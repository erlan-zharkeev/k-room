import type { ProtectedActionReason, SecurityAction } from 'global-shared'
import type { RedisClientType } from 'redis'

export interface RedisAdapterClients {
  publishClient: RedisClientType
  subscribeClient: RedisClientType
}

export interface ProtectedActionDecision {
  action: SecurityAction
  reason: ProtectedActionReason
  nextTryAt?: number
}

export interface TurnstileVerificationResponse {
  success: boolean
  action?: string
  hostname?: string
  'error-codes'?: string[]
}
