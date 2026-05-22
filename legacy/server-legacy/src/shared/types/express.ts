import { AvailableCookie, BackendResponse } from 'common'
import { Request, Response } from 'express'

export interface AppRequest extends Request {
  cookies: Partial<Record<AvailableCookie, string>>
}

export type AppResponse<T> = Response<BackendResponse<T>>
