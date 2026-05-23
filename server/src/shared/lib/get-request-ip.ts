import type { Request } from 'express'
import { isString } from 'global-shared'

const getHeaderIp = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return getHeaderIp(value[0])
  }

  if (!isString(value)) {
    return ''
  }

  const [ip] = value.split(',')

  return ip?.trim() ?? ''
}

const normalizeIp = (value: string) => value.replace(/^::ffff:/, '')

export const getRequestIp = (request: Request) => {
  const ip =
    getHeaderIp(request.headers?.['cf-connecting-ip']) ||
    getHeaderIp(request.headers?.['x-forwarded-for']) ||
    getHeaderIp(request.headers?.['x-real-ip']) ||
    request.ip ||
    request.socket?.remoteAddress ||
    ''

  return normalizeIp(ip)
}
