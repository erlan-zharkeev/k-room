import type { UnknownObject } from '../shared/types'

import type { AppLanguage, LocalizedText, PluralForms } from './types'

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

export const defineI18n = <const T extends UnknownObject>(value: I18nRecordConstraint<T>) => value

export const formatPlural = (language: AppLanguage, quantity: number, forms: PluralForms) => {
  const pluralRule = new Intl.PluralRules(language).select(quantity)
  const form = forms[pluralRule] ?? forms.other

  return `${quantity} ${form}`
}
