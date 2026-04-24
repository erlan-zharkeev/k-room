import { Module } from '@nestjs/common'

import { EmailService } from '../email/email.service'
import { UserService } from '../user/user.service'

import { CodesController } from './codes.controller'
import { CodesService } from './codes.service'

@Module({
  controllers: [CodesController],
  providers: [CodesService, EmailService, UserService]
})
export class CodesModule {}
