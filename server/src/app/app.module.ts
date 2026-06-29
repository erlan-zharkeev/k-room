import { Module } from '@nestjs/common'

import { AuthModule } from '../modules/auth/auth.module'
import { CodesModule } from '../modules/codes/codes.module'
import { MediaModule } from '../modules/media/media.module'
import { UserModule } from '../modules/user/user.module'

import { ClientRuntimePolicyController } from './client-runtime-policy.controller'
import { HealthController } from './health.controller'
import { SentryTunnelController } from './sentry-tunnel.controller'
import { SocketModule } from './socket.module'

@Module({
  imports: [AuthModule, CodesModule, MediaModule, SocketModule, UserModule],
  controllers: [HealthController, ClientRuntimePolicyController, SentryTunnelController]
})
export class AppModule {}
