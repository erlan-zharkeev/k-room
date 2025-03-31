import { useMemo, useState } from 'react'
import { TextInputValidateRule, ValidateRule } from './types'
import { AppFormFieldValue } from 'src/shared/ui/AppForm/types'
export type { ValidateRule, SwitchValidateRule, TextInputValidateRule } from './types'

export const booleanValidateRules = {
  requiredTrue: (value: boolean) => (!value ? ['Field is required'] : [])
}

export const stringValidateRules = {
  required: (value: string) => (value.length <= 0 ? ['Field is required'] : []),
  minLength: (value: string, { quantity = 0 }) => {
    return quantity && String(value).length < quantity ? [`At least ${quantity} characters are required`] : []
  },
  email: (value: string) =>
    !Boolean(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) ? ['Email is required'] : [],
  username: (value: string) => {
    const excludeSymbolError =
      value.includes('@') || value.includes('#') || value.includes('$') ? 'Username must not contain @ # $ symbols' : ''
    const requiredField = stringValidateRules.required(value)
    return [requiredField, excludeSymbolError].flat().filter((error) => error !== '')
  },
  password: (value: string) => {
    const latinLetterError = !Boolean(/^[a-zA-Z0-9]+$/.test(value))
      ? 'Field must consist only of Latin letters and numbers'
      : ''
    const minLengthError = stringValidateRules.minLength(value, { quantity: 6 })
    return [minLengthError, latinLetterError].flat().filter((error) => error !== '')
  }
}

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
        currentErrors = stringValidateRules[rule.name as keyof typeof stringValidateRules](
          value,
          rule as TextInputValidateRule
        )
      } else {
        console.warn(`Unknown string validation rule: ${rule.name}`)
      }
    } else if (typeof value === 'boolean') {
      if (rule.name in booleanValidateRules) {
        currentErrors = booleanValidateRules[rule.name as keyof typeof booleanValidateRules](value)
      } else {
        console.warn(`Unknown boolean validation rule: ${rule.name}`)
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
