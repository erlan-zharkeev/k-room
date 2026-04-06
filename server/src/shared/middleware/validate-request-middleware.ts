import { NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { LocalizedTextType, REQ_STATUS } from 'common'

import { AppResponseType, IAppRequest, SHARED_I18N } from 'src/shared/config'
import { localizedText } from 'src/shared/lib'

export const validateRequestMiddleware = (req: IAppRequest, res: AppResponseType<null>, next: NextFunction) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) next()

  const error: LocalizedTextType<string> | undefined = errors.array()[0]?.msg
  const errorSource = error ?? SHARED_I18N.commonServerError

  return res.status(REQ_STATUS.badRequest).json({
    payload: null,
    message: {
      text: localizedText(errorSource, req.language),
      silent: false
    }
  })
}
