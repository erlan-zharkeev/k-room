import { AuthTokensType } from 'common'
import { Response } from 'express'

import { parseExpires, setCookie } from 'src/modules/cookie'

import { SERVER_ENV } from 'src/shared/config'

import { generateToken } from './generate-token'

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
    domain: SERVER_ENV.domain,
    maxAge: parseExpires(expiresAt)
  })

  return token
}
