import { booleanValidateRules, stringValidateRules, arrayValidateRules } from 'src/shared/lib/hooks/use-validate/rules'

type ValidateBooleanRuleType = keyof typeof booleanValidateRules
type ValidateTextRuleType = keyof typeof stringValidateRules
type ValidateArrayRuleType = keyof typeof arrayValidateRules

export interface ISwitchValidateRule {
  name: ValidateBooleanRuleType
}
export interface ITextInputValidateRule {
  name: ValidateTextRuleType
  quantity?: number
}

export interface IFileInputValidateRule {
  name: ValidateBooleanRuleType
}

export interface IElementPickerValidateRule {
  name: ValidateArrayRuleType
}

export type ValidateRuleType =
  | ISwitchValidateRule
  | ITextInputValidateRule
  | IFileInputValidateRule
  | IElementPickerValidateRule
