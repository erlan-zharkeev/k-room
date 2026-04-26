import type { FormResolverOptions } from '@primevue/forms/form'

import { useI18n } from '../i18n/use-i18n'

import type { FormFieldNameType, FormRulesType, FormValidationRuleType } from './types'

export const usePrimeVueFormResolver = <T extends object>(rules: FormRulesType<T>) => {
  const { t } = useI18n()

  return ({ values }: FormResolverOptions) => {
    const errors: Record<string, { message: string }[]> = {}
    const ruleEntries = Object.entries(rules) as [FormFieldNameType<T>, FormValidationRuleType<unknown>[]][]

    ruleEntries.forEach(([fieldName, fieldRules]) => {
      for (const rule of fieldRules ?? []) {
        const error = rule(values[fieldName])

        if (error) {
          errors[fieldName] = [{ message: t(error) }]
          break
        }
      }
    })

    return {
      values,
      errors
    }
  }
}
