import { MESSAGE_ATTACHMENT_LIMIT, MESSAGE_BODY_MAX_LENGTH, REQ_STATUS } from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

import { MESSAGES_I18N } from '../messages.i18n'

export const assertMessageContentLimits = (
  body: string,
  images: readonly unknown[],
  documents: readonly unknown[],
  audios: readonly unknown[],
  videos: readonly unknown[]
) => {
  if (body.length > MESSAGE_BODY_MAX_LENGTH) {
    throw new AppError(REQ_STATUS.badRequest, MESSAGES_I18N.messageBodyTooLong)
  }

  const attachmentsQuantity = images.length + documents.length + audios.length + videos.length

  if (attachmentsQuantity > MESSAGE_ATTACHMENT_LIMIT) {
    throw new AppError(REQ_STATUS.badRequest, MESSAGES_I18N.messageAttachmentLimitReached)
  }
}
