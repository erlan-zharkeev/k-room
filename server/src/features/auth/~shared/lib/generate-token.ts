import jwt, { SignOptions } from 'jsonwebtoken'

export const generateToken = (id: string, secret: string, expiresIn: number | string) => {
  const payload = { id }
  const result = jwt.sign(payload, secret, { expiresIn } as SignOptions)
  return result
}
