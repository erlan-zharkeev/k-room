import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { PresenceService } from 'src/modules/presence/presence.service'
import { RedisService } from 'src/modules/security/redis.service'

import { initIO } from './socket'

@Injectable()
export class SocketService implements OnApplicationBootstrap {
  private initialized = false

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly redisService: RedisService,
    private readonly presenceService: PresenceService
  ) {}

  async onApplicationBootstrap() {
    if (this.initialized) {
      return
    }

    await initIO(this.httpAdapterHost.httpAdapter.getHttpServer(), this.redisService, this.presenceService)
    this.presenceService.startPresenceMonitoring()
    this.initialized = true
  }
}
