import { Module } from '@nestjs/common'

import { EmailService } from '../email/email.service'
import { UserService } from '../user/user.service'

import { AuthController } from './auth.controller'
import { AccessTokenGuard, RefreshTokenGuard } from './auth.guard'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService, UserService, AccessTokenGuard, RefreshTokenGuard],
  exports: [AuthService, AccessTokenGuard, RefreshTokenGuard, UserService]
})
export class AuthModule {}
