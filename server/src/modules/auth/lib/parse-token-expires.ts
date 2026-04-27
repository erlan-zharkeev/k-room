import { isNumber } from 'global-shared'

import {
  DEFAULT_COOKIE_MAX_AGE_MS,
  SECOND_IN_MS,
  TOKEN_EXPIRES_PATTERN,
  TOKEN_EXPIRES_UNIT_TO_MS
} from '../auth.constants'

export const parseTokenExpires = (expires: string | number) => {
  if (isNumber(expires)) {
    return expires * SECOND_IN_MS
  }

  const match = expires.match(TOKEN_EXPIRES_PATTERN)

  if (!match) {
    return DEFAULT_COOKIE_MAX_AGE_MS
  }

  const [, value, unit] = match
  const unitInMs = TOKEN_EXPIRES_UNIT_TO_MS[unit as keyof typeof TOKEN_EXPIRES_UNIT_TO_MS]

  return Number(value) * unitInMs
}
