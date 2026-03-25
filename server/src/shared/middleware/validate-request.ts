import { NextFunction, Request } from 'express'
import { validationResult } from 'express-validator'

import { type LocalizedTextType, StatusEnum } from 'common-types'

import { AppResponseType } from 'shared-config'
import { getLocalizedText } from 'shared-lib'

export const validateRequest = (req: Request, res: AppResponseType<null>, next: NextFunction) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const text = errors.array().map((err) => err.msg)[0]

    return res.status(StatusEnum.BadRequest).json({
      payload: null,
      message: {
        text: typeof text === 'object' && text !== null
          ? getLocalizedText(text as LocalizedTextType, (req as { language?: 'en' | 'ru' }).language)
          : String(text),
        silent: false
      }
    })
  }

  next()
}
