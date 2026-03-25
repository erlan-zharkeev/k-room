import { CookieOptions, Response } from 'express'

import { AvailableCookieType } from 'common'

export const setCookie = (res: Response, name: AvailableCookieType, value: string, options: CookieOptions) => {
  res.cookie(name, value, options)
}
