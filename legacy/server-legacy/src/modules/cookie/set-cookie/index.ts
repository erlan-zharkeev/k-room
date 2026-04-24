import { AvailableCookieType } from 'common'
import { CookieOptions, Response } from 'express'

export const setCookie = (res: Response, name: AvailableCookieType, value: string, options: CookieOptions) => {
  res.cookie(name, value, options)
}
