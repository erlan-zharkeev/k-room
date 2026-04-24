import { Module } from '@nestjs/common'

import { AuthModule } from '../modules/auth/auth.module'
import { CodesModule } from '../modules/codes/codes.module'
import { MediaModule } from '../modules/media/media.module'
import { UserController } from '../modules/user/user.controller'

import { HealthController } from './health.controller'

@Module({
  imports: [AuthModule, CodesModule, MediaModule],
  controllers: [HealthController, UserController]
})
export class AppModule {}
