import { useMemo, useState } from 'react'

import type { AppFormFieldValue } from 'src/shared/ui/AppForm'

import { stringValidateRules, booleanValidateRules, arrayValidateRules } from './rules'
import type {
  IElementPickerValidateRule,
  IFileInputValidateRule,
  ISwitchValidateRule,
  ITextInputValidateRule,
  ValidateRule
} from './types'

export const useValidate = (form: Record<string, AppFormFieldValue>) => {
  const initialErrorFields = Object.fromEntries(Object.keys(form).map((field) => [field, []]))
  const [errors, setErrors] = useState<Record<string, string[]>>(initialErrorFields)
  const initialTouchedFields = Object.fromEntries(Object.keys(form).map((field) => [field, false]))
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(initialTouchedFields)

  const isFormTouched = useMemo(() => Object.values(touchedFields).some((field) => field), [touchedFields])

  const isFormTotalValid = useMemo(() => {
    const isErrorsBoxEmpty = Object.values(errors).every((fieldErrors) => fieldErrors.length === 0)
    const isValid = isErrorsBoxEmpty && isFormTouched
    return isValid
  }, [errors, touchedFields])

  const validateField = (value: AppFormFieldValue, fieldName: string, silent = false, rule?: ValidateRule) => {
    if (!silent && !touchedFields[fieldName]) {
      setTouchedFields((touchedFields) => ({ ...touchedFields, [fieldName]: true }))
    }

    if (!rule) return
    let currentErrors: string[] = []
    if (typeof value === 'string') {
      if (rule.name in stringValidateRules) {
        const inferredRule = rule as ITextInputValidateRule
        currentErrors = stringValidateRules[inferredRule.name](value, inferredRule)
      } else {
        console.warn(`Unknown string validation rule: ${rule.name}`)
      }
    } else if (typeof value === 'boolean') {
      if (rule.name in booleanValidateRules) {
        const inferredRule = rule as ISwitchValidateRule | IFileInputValidateRule
        currentErrors = booleanValidateRules[inferredRule.name](value)
      } else {
        console.warn(`Unknown boolean validation rule: ${rule.name}`)
      }
    } else if (Array.isArray(value)) {
      if (rule.name in arrayValidateRules) {
        const inferredRule = rule as IElementPickerValidateRule
        currentErrors = arrayValidateRules[inferredRule.name](value)
      }
    }

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors }
      if (currentErrors) {
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = []
        }
        newErrors[fieldName] = currentErrors
      } else {
        if (newErrors[fieldName]) {
          newErrors[fieldName] = []
        }
      }
      return newErrors
    })
  }

  return {
    errors,
    setErrors,
    isFormTotalValid,
    isFormTouched,
    validateField,
    touchedFields
  }
}
