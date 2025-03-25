import { booleanValidateRules, stringValidateRules } from '.'

type ValidateBooleanRule = keyof typeof booleanValidateRules
type ValidateTextRule = keyof typeof stringValidateRules

export type SwitchValidateRule = { name: ValidateBooleanRule }
export type TextInputValidateRule = { name: ValidateTextRule; quantity?: number }
export type ValidateRule = SwitchValidateRule | TextInputValidateRule
