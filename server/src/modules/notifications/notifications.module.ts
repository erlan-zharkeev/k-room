import { Module } from '@nestjs/common'

import { PresenceModule } from '../presence/presence.module'
import { SessionModule } from '../session/session.module'

import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [PresenceModule, SessionModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService]
})
export class NotificationsModule {}
