import { AvailableCookieType } from 'common-types'
import { Request } from 'express'

export interface IRequest extends Request {
  cookies: Partial<Record<AvailableCookieType, string>>
}
