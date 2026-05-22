import { Controller, Get } from '@nestjs/common'

import type { HealthResponse } from './types'

@Controller()
export class HealthController {
  @Get('health')
  getHealth(): HealthResponse {
    return { ok: true }
  }
}
