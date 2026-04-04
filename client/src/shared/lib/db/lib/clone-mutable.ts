import { MutableType } from '../config'

export const cloneMutable = <T extends object>(value: T): MutableType<T> => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value) as MutableType<T>
  }
  return JSON.parse(JSON.stringify(value)) as MutableType<T>
}
