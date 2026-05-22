import { NextFunction, Request } from 'express'

import { AppResponse } from 'src/shared/config'
import { getRequestLanguage } from 'src/shared/lib/get-language'

export const httpRequestLanguageMiddleware = (req: Request, _: AppResponse<null>, next: NextFunction) => {
  req.language = getRequestLanguage(req.headers)
  next()
}
