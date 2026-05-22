import { AvailableCookie } from 'common'
import { CookieOptions, Response } from 'express'

export const setCookie = (res: Response, name: AvailableCookie, value: string, options: CookieOptions) => {
  res.cookie(name, value, options)
}
