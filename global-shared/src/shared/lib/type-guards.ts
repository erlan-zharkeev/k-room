import type { UnknownObject } from '../types'

export const isUnknownObject = (value: unknown): value is UnknownObject => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
