import type { CodeRequestResponse } from 'global-shared'

export interface SendPasswordRecoveryCodeResult extends CodeRequestResponse {
  tooManyRequests: boolean
}

export interface SendChangeEmailCodeResult extends CodeRequestResponse {
  tooManyRequests: boolean
}
