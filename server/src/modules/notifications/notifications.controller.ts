import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import type { Request, Response } from 'express'
import {
  type BackendResponse,
  type DeleteWebPushSubscriptionPayload,
  NOTIFICATION_ENDPOINTS,
  type WebPushConfigResponse,
  type WebPushSubscriptionPayload
} from 'global-shared'

import { SHARED_I18N } from 'src/shared/i18n'
import { runRequestValidation } from 'src/shared/lib/run-request-validation'
import { sendResponse } from 'src/shared/lib/send-response'

import { requireAuthUserId } from '../session/lib/require-auth-user-id'
import { AccessTokenGuard } from '../session/session.guard'
import { SessionService } from '../session/session.service'

import { NotificationsService } from './notifications.service'
import { DELETE_WEB_PUSH_SUBSCRIPTION_VALIDATION, WEB_PUSH_SUBSCRIPTION_VALIDATION } from './notifications.validation'

@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly sessionService: SessionService
  ) {}

  @Get(NOTIFICATION_ENDPOINTS.getWebPushConfig)
  @UseGuards(AccessTokenGuard)
  getWebPushConfig(@Req() request: Request, @Res() response: Response<BackendResponse<WebPushConfigResponse>>) {
    const { language } = request
    const payload = this.notificationsService.getWebPushConfig()

    return sendResponse(response, language, payload, SHARED_I18N.success, true)
  }

  @Post(NOTIFICATION_ENDPOINTS.upsertWebPushSubscription)
  @UseGuards(AccessTokenGuard)
  async upsertWebPushSubscription(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<null>>,
    @Body() payload: WebPushSubscriptionPayload
  ) {
    const { language } = request
    const userId = requireAuthUserId(request, this.sessionService.getUnauthorizedMessage())

    runRequestValidation(request, WEB_PUSH_SUBSCRIPTION_VALIDATION)
    await this.notificationsService.upsertWebPushSubscription(userId, payload)

    return sendResponse(response, language, null, SHARED_I18N.success, true)
  }

  @Delete(NOTIFICATION_ENDPOINTS.deleteWebPushSubscription)
  @UseGuards(AccessTokenGuard)
  async deleteWebPushSubscription(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<null>>,
    @Body() payload: DeleteWebPushSubscriptionPayload
  ) {
    const { language } = request
    const userId = requireAuthUserId(request, this.sessionService.getUnauthorizedMessage())

    runRequestValidation(request, DELETE_WEB_PUSH_SUBSCRIPTION_VALIDATION)
    await this.notificationsService.deleteWebPushSubscription(userId, payload)

    return sendResponse(response, language, null, SHARED_I18N.success, true)
  }
}
