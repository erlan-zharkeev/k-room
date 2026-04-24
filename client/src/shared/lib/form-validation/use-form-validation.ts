import type { LocalizedTextType } from 'global-shared'
import { computed, reactive, ref } from 'vue'

import { useI18n } from '../i18n/use-i18n'

import type { FormErrorsType, FormFieldNameType, FormRulesType, FormTouchedType, FormValidationRuleType } from './types'

export const useFormValidation = <T extends object>(formData: T, rules: FormRulesType<T>) => {
  const { t } = useI18n()
  const submitted = ref(false)
  const touchedFields = reactive({}) as FormTouchedType<T>

  const errors = computed(() => {
    const nextErrors = {} as FormErrorsType<T>
    const ruleEntries = Object.entries(rules) as [FormFieldNameType<T>, FormValidationRuleType<unknown>[]][]

    ruleEntries.forEach(([fieldName, fieldRules]) => {
      const fieldErrors = []

      for (const rule of fieldRules ?? []) {
        const error = rule(formData[fieldName])

        if (error) {
          fieldErrors.push(error)
          break
        }
      }

      nextErrors[fieldName] = fieldErrors
    })

    return nextErrors
  })

  const visibleErrors = computed(() => {
    const nextErrors = {} as FormErrorsType<T>
    const errorEntries = Object.entries(errors.value) as [FormFieldNameType<T>, LocalizedTextType[] | undefined][]

    errorEntries.forEach(([fieldName, fieldErrors]) => {
      nextErrors[fieldName] = submitted.value || touchedFields[fieldName] ? fieldErrors : []
    })

    return nextErrors
  })

  const isFormValid = computed(() => {
    const fieldErrorsList = Object.values(errors.value) as (LocalizedTextType[] | undefined)[]

    return fieldErrorsList.every((fieldErrors) => !fieldErrors?.length)
  })

  const touchField = (field: FormFieldNameType<T>) => {
    touchedFields[field] = true
  }

  const getFirstError = (field: FormFieldNameType<T>) => visibleErrors.value[field]?.[0]
  const getFirstErrorText = (field: FormFieldNameType<T>) => {
    const error = getFirstError(field)

    return error ? t(error) : ''
  }

  const submitForm = (onValid: () => void) => {
    submitted.value = true

    if (!isFormValid.value) return

    onValid()
  }

  return {
    errors,
    getFirstError,
    getFirstErrorText,
    visibleErrors,
    isFormValid,
    touchField,
    submitForm
  }
}
