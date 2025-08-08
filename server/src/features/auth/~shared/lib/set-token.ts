import type { AuthTokensType } from 'common-types'
import { type Response } from 'express'
import { generateToken, parseExpires } from 'features/auth'
import { setCookie } from 'features/cookie'

export const setToken = (
  res: Response,
  tokenName: AuthTokensType,
  id: string,
  secret: string,
  expiresIn: number | string
): string => {
  const token = generateToken(id, secret, expiresIn)
  setCookie(res, tokenName, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: parseExpires(expiresIn)
  })
  return token
}
