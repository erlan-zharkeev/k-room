import { AvailableCookieType } from 'common-types'
import { CookieOptions, Response } from 'express'

export const setCookie = (res: Response, name: AvailableCookieType, value: string, options: CookieOptions) => {
  res.cookie(name, value, options)
}
