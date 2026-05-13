import { Module } from '@nestjs/common'

import { EmailService } from '../email/email.service'
import { SecurityModule } from '../security/security.module'
import { SessionModule } from '../session/session.module'
import { UserModule } from '../user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [SecurityModule, SessionModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService]
})
export class AuthModule {}
