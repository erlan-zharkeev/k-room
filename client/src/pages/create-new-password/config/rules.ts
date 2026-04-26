import { passwordMinLengthRule, requiredPasswordRule, strongPasswordRule, type FormRulesType } from 'src/shared/lib'

import type { ICreateNewPasswordForm } from '../model/types'

export const CREATE_NEW_PASSWORD_RULES: FormRulesType<ICreateNewPasswordForm> = {
  firstPassword: [requiredPasswordRule, passwordMinLengthRule, strongPasswordRule],
  secondPassword: [requiredPasswordRule, passwordMinLengthRule, strongPasswordRule]
}
