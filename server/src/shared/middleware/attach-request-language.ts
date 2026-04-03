import { NextFunction } from 'express'

import { AppResponseType, IAppRequest } from 'src/shared/config'
import { getRequestLanguage } from 'src/shared/lib'

export const attachRequestLanguage = (req: IAppRequest, _: AppResponseType<null>, next: NextFunction) => {
  req.language = getRequestLanguage(req.headers)
  next()
}
