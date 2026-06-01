import type { FormField, FormPatternRule, FormRule } from 'src/shared/lib'

export interface RegistrationBooleanRule extends FormRule {
  booleanCompareType: 'eq' | 'not-eq'
  compareValue: boolean
}

export interface RegistrationFormData {
  nickname: FormField<string, FormPatternRule>
  email: FormField<string, FormPatternRule>
  password: FormField<string, FormPatternRule>
  policy: FormField<boolean, RegistrationBooleanRule>
}

export interface RegistrationInitialFormData {
  nickname: string
  email: string
  password: string
  policy: boolean
}
