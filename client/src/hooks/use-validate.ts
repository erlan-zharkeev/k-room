import { useState } from 'react'
interface ValidationForm {
  getFieldsError: () => any[]
  getFieldsValue: () => { [s: string]: string }
}

export const useValidate = (): [boolean, (form: ValidationForm) => void] => {
  const [isValid, setIsValid] = useState(false)

  const validate = (form: ValidationForm) => {
    setTimeout(() => {
      const errors = [] as Array<Boolean>
      form.getFieldsError().forEach((field) => {
        errors.push(!!field.errors.length)
      })
      const hasError = errors.some((error) => Boolean(error))
      const isTouched = Object.values(form.getFieldsValue()).every((field) => field)
      setIsValid(!hasError && isTouched)
    })
  }

  return [isValid, validate]
}
