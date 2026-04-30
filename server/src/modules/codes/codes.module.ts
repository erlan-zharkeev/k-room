import { Module } from '@nestjs/common'

import { EmailService } from '../email/email.service'
import { SecurityModule } from '../security/security.module'
import { UserService } from '../user/user.service'

import { CodesController } from './codes.controller'
import { CodesService } from './codes.service'

@Module({
  imports: [SecurityModule],
  controllers: [CodesController],
  providers: [CodesService, EmailService, UserService]
})
export class CodesModule {}
