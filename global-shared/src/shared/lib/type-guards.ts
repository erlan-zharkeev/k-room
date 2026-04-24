import type { UnknownObject } from '../types'

export const isUnknownObject = (value: unknown): value is UnknownObject => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number'
}
