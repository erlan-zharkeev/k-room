import type { IAuthLoginPayload } from 'global-shared'

import { requiredEmailRule, requiredPasswordRule, type FormRulesType } from 'src/shared/lib'

export const LOGIN_FORM_RULES = {
  email: [requiredEmailRule],
  password: [requiredPasswordRule]
} satisfies FormRulesType<IAuthLoginPayload>
