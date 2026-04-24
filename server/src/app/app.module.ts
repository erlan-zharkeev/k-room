import { Module } from '@nestjs/common'

import { AuthModule } from '../modules/auth/auth.module'
import { UserController } from '../modules/user/user.controller'

import { HealthController } from './health/health.controller'

@Module({
  imports: [AuthModule],
  controllers: [HealthController, UserController]
})
export class AppModule {}
