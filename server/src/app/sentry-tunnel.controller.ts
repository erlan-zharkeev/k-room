import { Controller, HttpCode, Post, Req } from '@nestjs/common'
import { type Request } from 'express'
import { MONITORING_ENDPOINTS, REQ_STATUS } from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { SENTRY_CLIENT_ENVELOPE_URL, SENTRY_TUNNEL_MAX_BODY_BYTES, SENTRY_TUNNEL_TIMEOUT_MS } from './constants'

const readRequestBody = (request: Request) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    let bodySize = 0
    let bodyTooLarge = false

    request.on('data', (chunk: Buffer | string) => {
      if (bodyTooLarge) return

      const chunkBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      bodySize += chunkBuffer.length

      if (bodySize > SENTRY_TUNNEL_MAX_BODY_BYTES) {
        bodyTooLarge = true
        reject(new AppError(REQ_STATUS.badRequest, 'Sentry envelope is too large', true))
        return
      }

      chunks.push(chunkBuffer)
    })

    request.on('end', () => {
      if (bodyTooLarge) return

      resolve(Buffer.concat(chunks))
    })
    request.on('error', reject)
  })

@Controller()
export class SentryTunnelController {
  @Post(MONITORING_ENDPOINTS.sentryEnvelope)
  @HttpCode(REQ_STATUS.success)
  async forwardEnvelope(@Req() request: Request) {
    const body = await readRequestBody(request)

    if (!body.length) {
      throw new AppError(REQ_STATUS.badRequest, 'Sentry envelope is empty', true)
    }

    const response = await fetch(SENTRY_CLIENT_ENVELOPE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      body,
      signal: AbortSignal.timeout(SENTRY_TUNNEL_TIMEOUT_MS)
    })

    if (!response.ok) {
      throw new AppError(REQ_STATUS.badGateway, 'Sentry envelope forwarding failed', true)
    }

    return {}
  }
}
