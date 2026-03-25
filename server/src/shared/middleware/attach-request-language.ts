import type { NextFunction } from 'express'

import { type AppResponseType, type IAppRequest } from 'shared-config'
import { getRequestLanguage } from 'shared-lib'

export const attachRequestLanguage = (req: IAppRequest, _: AppResponseType<null>, next: NextFunction) => {
  req.language = getRequestLanguage(req.headers)
  next()
}
