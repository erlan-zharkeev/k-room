import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common'
import { type Request, type Response } from 'express'
import { MEDIA_ENDPOINTS, type IBackendResponse, REQ_STATUS } from 'global-shared'

import { toAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { AccessTokenGuard } from '../session/session.guard'

import { GET_MEDIA_FILE_I18N } from './media.i18n'
import { MediaService } from './media.service'

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(`${MEDIA_ENDPOINTS.getMediaFile}/:id`)
  @UseGuards(AccessTokenGuard)
  async getMediaFile(
    @Req() request: Request,
    @Res() response: Response<IBackendResponse<null>>,
    @Query('download') download?: string,
    @Query('revalidate') revalidate?: string
  ) {
    const { language, params } = request
    const id = String(params.id ?? '')

    try {
      if (!id) {
        throw toAppError(null, localizedText(GET_MEDIA_FILE_I18N.idNotProvideOrNotValid, language), REQ_STATUS.notFound)
      }

      await this.mediaService.getMediaFile(id, language, response, {
        asAttachment: ['1', 'true', 'yes'].includes(String(download ?? '').toLowerCase()),
        revalidateCache: Boolean(revalidate)
      })
    } catch (error) {
      throw toAppError(error, localizedText(GET_MEDIA_FILE_I18N.failedToProvideMedia, language))
    }
  }
}
