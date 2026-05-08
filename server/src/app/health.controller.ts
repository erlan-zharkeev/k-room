import { Controller, Get } from '@nestjs/common'

import type { IHealthResponse } from './types'

@Controller()
export class HealthController {
  @Get('health')
  getHealth(): IHealthResponse {
    return { ok: true }
  }
}
