import { Module } from '@nestjs/common'

import { PresenceModule } from 'src/modules/presence/presence.module'
import { SecurityModule } from 'src/modules/security/security.module'

import { SocketService } from './socket.service'

@Module({
  imports: [PresenceModule, SecurityModule],
  providers: [SocketService]
})
export class SocketModule {}
