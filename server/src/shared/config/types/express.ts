import { Request, Response } from 'express'

import { AvailableCookieType, IBackendResponse } from 'common'

export interface IAppRequest extends Request {
  cookies: Partial<Record<AvailableCookieType, string>>
}

export type AppResponseType<T> = Response<IBackendResponse<T>>
