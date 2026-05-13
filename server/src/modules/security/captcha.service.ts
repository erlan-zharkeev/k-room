import { randomUUID } from 'node:crypto'

import { Injectable } from '@nestjs/common'

import { SERVER_ENV } from 'src/app/env'

import { TURNSTILE_VERIFY_TIMEOUT_MS, TURNSTILE_VERIFY_URL } from './constants'
import type { ITurnstileVerificationResponse } from './types'

@Injectable()
export class CaptchaService {
  isConfigured() {
    return Boolean(SERVER_ENV.security.turnstileSecretKey)
  }

  async validateToken(token: string, ip: string, action: string) {
    if (!this.isConfigured()) {
      return false
    }

    const body = new FormData()

    body.set('secret', SERVER_ENV.security.turnstileSecretKey)
    body.set('response', token)
    body.set('remoteip', ip)
    body.set('idempotency_key', randomUUID())

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(TURNSTILE_VERIFY_TIMEOUT_MS)
    })
    const result = (await response.json()) as ITurnstileVerificationResponse

    if (!result.success) {
      return false
    }

    return !result.action || result.action === action
  }
}
