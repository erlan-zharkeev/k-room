export const booleanValidateRules = {
  requiredTrue: (value: boolean) => (!value ? ['Field is required'] : [])
}

export const stringValidateRules = {
  required: (value: string) => (value.length <= 0 ? ['Field is required'] : []),
  minLength: (value: string, { quantity = 0 }) => {
    return quantity && String(value).length < quantity ? [`At least ${quantity} characters are required`] : []
  },
  email: (value: string) =>
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ? ['Email is required'] : [],
  username: (value: string) => {
    const excludeSymbolError =
      value.includes('@') || value.includes('#') || value.includes('$') ? 'Username must not contain @ # $ symbols' : ''
    const requiredField = stringValidateRules.required(value)
    return [requiredField, excludeSymbolError].flat().filter((error) => error !== '')
  },
  password: (value: string) => {
    const allowedSymbolsRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/
    const latinLetterError = !allowedSymbolsRegex.test(value)
      ? 'Password must consist only of Latin letters, numbers, and allowed symbols'
      : ''
    const minLengthError = stringValidateRules.minLength(value, { quantity: 6 })
    const capitalLetterError = !/[A-Z]/.test(value) ? 'Password must contain at least one uppercase letter' : ''
    return [minLengthError, latinLetterError, capitalLetterError].flat().filter((error) => error !== '')
  }
}

export const arrayValidateRules = {
  required: (value: unknown[]) => (value.length <= 0 ? ['Field is required'] : [])
}
