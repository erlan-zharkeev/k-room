import {
  passwordMinLengthRule,
  requiredAgreementRule,
  requiredEmailRule,
  requiredPasswordRule,
  strongPasswordRule,
  usernameMaxLengthRule,
  usernameMinLengthRule,
  validEmailRule,
  type FormRulesType
} from 'src/shared/lib'

import type { RegistrationFormDataType } from '../model/types'

export const REGISTRATION_FORM_RULES = {
  username: [usernameMinLengthRule, usernameMaxLengthRule],
  email: [requiredEmailRule, validEmailRule],
  password: [requiredPasswordRule, passwordMinLengthRule, strongPasswordRule],
  policy: [requiredAgreementRule]
} satisfies FormRulesType<RegistrationFormDataType>
