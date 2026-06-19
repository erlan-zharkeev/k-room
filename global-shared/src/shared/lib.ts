import type { UnknownCallback, UnknownObject } from './types'

export const formatAppName = (value: string) => value.replace(/\b\w/g, (char) => char.toUpperCase())

export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number'
}

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

export const isFunction = (value: unknown): value is UnknownCallback => {
  return typeof value === 'function'
}

export const isUnknownObject = (value: unknown): value is UnknownObject => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
