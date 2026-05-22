export interface RegistrationTextRule {
  pattern?: RegExp
  error: string
}

export interface RegistrationBooleanRule {
  booleanCompareType: 'eq' | 'not-eq'
  compareValue: boolean
  error: string
}

export interface RegistrationTextField {
  value: string
  rules: RegistrationTextRule[]
}

export interface RegistrationBooleanField {
  value: boolean
  rules: RegistrationBooleanRule[]
}

export interface RegistrationFormData {
  nickname: RegistrationTextField
  email: RegistrationTextField
  password: RegistrationTextField
  policy: RegistrationBooleanField
}

export interface RegistrationInitialFormData {
  nickname: string
  email: string
  password: string
  policy: boolean
}
