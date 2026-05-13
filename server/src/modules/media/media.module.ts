import { Module } from '@nestjs/common'

import { SessionModule } from '../session/session.module'

import { MediaController } from './media.controller'
import { MediaService } from './media.service'

@Module({
  imports: [SessionModule],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
