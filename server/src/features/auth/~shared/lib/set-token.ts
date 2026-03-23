import type { AuthTokensType } from 'common-types'
import { type Response } from 'express'

import { generateToken } from 'features/auth'
import { parseExpires, setCookie } from 'features/cookie'

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
    maxAge: parseExpires(expiresAt)
  })

  return token
}
