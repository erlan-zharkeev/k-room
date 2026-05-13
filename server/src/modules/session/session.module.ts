import { Module } from '@nestjs/common'

import { AccessTokenGuard, RefreshTokenGuard } from './session.guard'
import { SessionService } from './session.service'

@Module({
  providers: [SessionService, AccessTokenGuard, RefreshTokenGuard],
  exports: [SessionService, AccessTokenGuard, RefreshTokenGuard]
})
export class SessionModule {}
