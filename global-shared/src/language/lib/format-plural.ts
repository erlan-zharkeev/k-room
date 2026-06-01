import type { AppLanguage, PluralForms } from '../types'

export const formatPlural = (language: AppLanguage, quantity: number, forms: PluralForms) => {
  const pluralRule = new Intl.PluralRules(language).select(quantity)
  const form = forms[pluralRule] ?? forms.other

  return `${quantity} ${form}`
}
