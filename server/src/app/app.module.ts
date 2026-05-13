import { Module } from '@nestjs/common'

import { AuthModule } from '../modules/auth/auth.module'
import { CodesModule } from '../modules/codes/codes.module'
import { MediaModule } from '../modules/media/media.module'
import { UserModule } from '../modules/user/user.module'

import { HealthController } from './health.controller'
import { SocketModule } from './socket.module'

@Module({
  imports: [AuthModule, CodesModule, MediaModule, SocketModule, UserModule],
  controllers: [HealthController]
})
export class AppModule {}
