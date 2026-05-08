import type { UnknownObjectType } from '../../shared/types'
import type { LocalizedTextType } from '../types'

export type I18nValueConstraintType<T> = T extends (...args: infer Args) => infer Result
  ? Result extends LocalizedTextType<unknown>
    ? (...args: Args) => Result
    : never
  : T extends LocalizedTextType<unknown>
  ? T
  : never

export type I18nRecordConstraintType<T extends UnknownObjectType> = {
  [Key in keyof T]: I18nValueConstraintType<T[Key]>
}
