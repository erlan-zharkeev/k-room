import { Module } from '@nestjs/common'

import { SecurityModule } from '../security/security.module'
import { SessionModule } from '../session/session.module'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [SecurityModule, SessionModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
