import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { EmailService } from '../email/email.service'
import { SecurityModule } from '../security/security.module'

import { CodesController } from './codes.controller'
import { CodesService } from './codes.service'

@Module({
  imports: [AuthModule, SecurityModule],
  controllers: [CodesController],
  providers: [CodesService, EmailService]
})
export class CodesModule {}
