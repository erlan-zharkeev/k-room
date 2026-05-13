import { Module } from '@nestjs/common'

import { EmailService } from '../email/email.service'
import { SecurityModule } from '../security/security.module'
import { SessionModule } from '../session/session.module'
import { UserModule } from '../user/user.module'

import { CodesController } from './codes.controller'
import { CodesService } from './codes.service'

@Module({
  imports: [SecurityModule, SessionModule, UserModule],
  controllers: [CodesController],
  providers: [CodesService, EmailService]
})
export class CodesModule {}
