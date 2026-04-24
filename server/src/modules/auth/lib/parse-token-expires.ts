import { isNumber } from 'global-shared'

import {
  DEFAULT_COOKIE_MAX_AGE,
  MILLISECONDS_IN_SECOND,
  TOKEN_EXPIRES_PATTERN,
  TOKEN_EXPIRES_UNIT_TO_MS
} from '../auth.constants'

export const parseTokenExpires = (expires: string | number) => {
  if (isNumber(expires)) {
    return expires * MILLISECONDS_IN_SECOND
  }

  const match = expires.match(TOKEN_EXPIRES_PATTERN)

  if (!match) {
    return DEFAULT_COOKIE_MAX_AGE
  }

  const [, value, unit] = match
  const unitMs = TOKEN_EXPIRES_UNIT_TO_MS[unit as keyof typeof TOKEN_EXPIRES_UNIT_TO_MS]

  return Number(value) * unitMs
}
