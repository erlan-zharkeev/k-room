import { Mutable } from '../internals/types'

export const cloneMutable = <T extends object>(value: T): Mutable<T> => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value) as Mutable<T>
  }
  return JSON.parse(JSON.stringify(value)) as Mutable<T>
}
