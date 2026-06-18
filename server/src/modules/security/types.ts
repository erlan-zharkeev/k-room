import type { ProtectedActionReason, SecurityAction } from 'global-shared'
import type { RedisClientType } from 'redis'

export interface RedisAdapterClients {
  publishClient: RedisClientType
  subscribeClient: RedisClientType
}

export interface RedisCommandClient {
  sendCommand(command: string[]): Promise<unknown>
}

export interface ProtectedActionDecision {
  action: SecurityAction
  reason: ProtectedActionReason
  nextTryAt?: number
}

export interface SecurityEmailIpActionLimits {
  captchaEmailThreshold: number
  blockEmailThreshold: number
  captchaIpThreshold: number
  blockIpThreshold: number
}

export interface SecurityEmailIpActionParams {
  action: SecurityAction
  email: string
  ip: string
  captchaToken?: string
  limits: SecurityEmailIpActionLimits
}

export interface TurnstileVerificationResponse {
  success: boolean
  action?: string
  hostname?: string
  'error-codes'?: string[]
}
