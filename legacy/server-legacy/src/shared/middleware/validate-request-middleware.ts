import { LocalizedText, REQ_STATUS } from 'common'
import { NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { AppResponse, AppRequest, SHARED_I18N } from 'src/shared/config'
import { localizedText } from 'src/shared/lib/localized-text'

export const validateRequestMiddleware = (req: AppRequest, res: AppResponse<null>, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) next()

  const error: LocalizedText<string> | undefined = errors.array()[0]?.msg
  const errorSource = error ?? SHARED_I18N.commonServerError

  return res.status(REQ_STATUS.badRequest).json({
    payload: null,
    message: {
      text: localizedText(errorSource, req.language),
      silent: false
    }
  })
}
