import { AvailableCookieType, IBackendResponse } from 'common-types'
import { Request, Response } from 'express'

export interface IAppRequest extends Request {
  cookies: Partial<Record<AvailableCookieType, string>>
}

export type AppResponseType<T> = Response<IBackendResponse<T>>
