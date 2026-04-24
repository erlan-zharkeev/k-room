import { isString } from 'global-shared'

export const getHeaderValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return isString(value) ? value : ''
}
