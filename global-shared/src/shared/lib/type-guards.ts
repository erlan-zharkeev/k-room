import type { UnknownObjectType } from '../types'

export const isUnknownObject = (value: unknown): value is UnknownObjectType => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
