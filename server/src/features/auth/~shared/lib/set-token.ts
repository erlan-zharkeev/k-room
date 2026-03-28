import type { AuthTokensType } from 'common'
import { type Response } from 'express'

import { generateToken } from 'src/features/auth'
import { parseExpires, setCookie } from 'src/features/cookie'

import { ENV } from 'src/shared/config'

export const setToken = (
  res: Response,
  tokenName: AuthTokensType,
  id: string,
  secret: string,
  expiresAt: number | string
): string => {
  const token = generateToken(id, secret, expiresAt)
  setCookie(res, tokenName, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    domain: ENV.IS_DEV ? undefined : ENV.COOKIE_DOMAIN || undefined,
    maxAge: parseExpires(expiresAt)
  })

  return token
}
