import { Request, Response } from 'express'

import { AppLanguageType, AvailableCookieType, IBackendResponse } from 'common'

export interface IAppRequest extends Request {
  cookies: Partial<Record<AvailableCookieType, string>>
  language?: AppLanguageType
}

export type AppResponseType<T> = Response<IBackendResponse<T>>
