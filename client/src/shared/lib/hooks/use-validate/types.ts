import { booleanValidateRules, stringValidateRules } from '.'

type ValidateBooleanRule = keyof typeof booleanValidateRules
type ValidateTextRule = keyof typeof stringValidateRules

export interface SwitchValidateRule {
  name: ValidateBooleanRule
}
export interface TextInputValidateRule {
  name: ValidateTextRule
  quantity?: number
}

export interface FileInputValidateRule {
  name: ValidateBooleanRule
}

export type ValidateRule = SwitchValidateRule | TextInputValidateRule | FileInputValidateRule
