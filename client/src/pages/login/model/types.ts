import type { FormField, FormRequiredPatternRule } from 'src/shared/lib'

export interface LoginFormData {
  login: FormField<string, FormRequiredPatternRule>
  password: FormField<string, FormRequiredPatternRule>
}
