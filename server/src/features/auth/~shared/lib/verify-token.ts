import jwt from 'jsonwebtoken'

import { JWTDecoded } from 'shared-config'

export const verifyToken = (token: string, secret: string): Promise<JWTDecoded> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) return reject(error)
      resolve(decoded as JWTDecoded)
    })
  })
}
