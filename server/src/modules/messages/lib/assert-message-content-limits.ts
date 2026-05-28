import { MESSAGE_BODY_MAX_LENGTH, MESSAGE_IMAGE_LIMIT, REQ_STATUS } from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { MESSAGES_I18N } from '../messages.i18n'

export const assertMessageContentLimits = (body: string, images: readonly unknown[]) => {
  if (body.length > MESSAGE_BODY_MAX_LENGTH) {
    throw new AppError(REQ_STATUS.badRequest, MESSAGES_I18N.messageBodyTooLong)
  }

  if (images.length > MESSAGE_IMAGE_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, MESSAGES_I18N.messageImageLimitReached)
  }
}
