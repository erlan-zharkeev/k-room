export interface IRegistrationTextRule {
  pattern?: RegExp
  error: string
}

export interface IRegistrationBooleanRule {
  booleanCompareType: 'eq' | 'not-eq'
  compareValue: boolean
  error: string
}

export interface IRegistrationTextField {
  value: string
  rules: IRegistrationTextRule[]
}

export interface IRegistrationBooleanField {
  value: boolean
  rules: IRegistrationBooleanRule[]
}

export interface IRegistrationFormData {
  nickname: IRegistrationTextField
  email: IRegistrationTextField
  password: IRegistrationTextField
  policy: IRegistrationBooleanField
}

export interface IRegistrationInitialFormData {
  nickname: string
  email: string
  password: string
  policy: boolean
}
