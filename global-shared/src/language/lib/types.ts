import type { UnknownObject } from '../../shared/types'
import type { LocalizedText } from '../types'

export type I18nValueConstraint<T> = T extends (...args: infer Args) => infer Result
  ? Result extends LocalizedText<unknown>
    ? (...args: Args) => Result
    : never
  : T extends LocalizedText<unknown>
  ? T
  : never

export type I18nRecordConstraint<T extends UnknownObject> = {
  [Key in keyof T]: I18nValueConstraint<T[Key]>
}
