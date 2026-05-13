import { Module } from '@nestjs/common'

import { SecurityModule } from '../security/security.module'

import { PresenceService } from './presence.service'

@Module({
  imports: [SecurityModule],
  providers: [PresenceService],
  exports: [PresenceService]
})
export class PresenceModule {}
