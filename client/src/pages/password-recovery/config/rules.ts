import { requiredStringRule, validEmailRule, type FormRulesType } from 'src/shared/lib'

import type { IPasswordRecoveryCodeForm, IPasswordRecoveryEmailForm } from '../model/types'

export const PASSWORD_RECOVERY_EMAIL_RULES: FormRulesType<IPasswordRecoveryEmailForm> = {
  email: [requiredStringRule(), validEmailRule]
}

export const PASSWORD_RECOVERY_CODE_RULES: FormRulesType<IPasswordRecoveryCodeForm> = {
  code: [requiredStringRule()]
}
