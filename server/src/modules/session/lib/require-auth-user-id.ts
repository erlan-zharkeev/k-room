import { type Request } from 'express'
import { type LocalizedText, REQ_STATUS } from 'global-shared'

import { AppError } from 'src/shared/lib/app-error'

export const requireAuthUserId = (request: Request, messageSource: string | LocalizedText<string>) => {
  const { authUserId } = request

  if (!authUserId) {
    throw new AppError(REQ_STATUS.notAuth, messageSource)
  }

  return authUserId
}
