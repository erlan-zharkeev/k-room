import type { ProtectedActionReasonType, SecurityActionType } from 'global-shared'
import type { RedisClientType } from 'redis'

export interface IRedisAdapterClients {
  publishClient: RedisClientType
  subscribeClient: RedisClientType
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
