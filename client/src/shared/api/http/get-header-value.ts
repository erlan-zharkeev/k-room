import { isString } from 'lodash'

export const getHeaderValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return isString(value) ? value : ''
}
