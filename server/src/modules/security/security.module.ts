import { Module } from '@nestjs/common'

import { CaptchaService } from './captcha.service'
import { RedisService } from './redis.service'
import { SecurityService } from './security.service'

@Module({
  providers: [CaptchaService, RedisService, SecurityService],
  exports: [RedisService, SecurityService]
})
export class SecurityModule {}
