import { booleanValidateRules, stringValidateRules, arrayValidateRules } from 'src/shared/lib/hooks/use-validate/rules'

type ValidateBooleanRule = keyof typeof booleanValidateRules
type ValidateTextRule = keyof typeof stringValidateRules
type ValidateArrayRule = keyof typeof arrayValidateRules

export interface ISwitchValidateRule {
  name: ValidateBooleanRule
}
export interface ITextInputValidateRule {
  name: ValidateTextRule
  quantity?: number
}

export interface IFileInputValidateRule {
  name: ValidateBooleanRule
}

export interface IElementPickerValidateRule {
  name: ValidateArrayRule
}

export type ValidateRule =
  | ISwitchValidateRule
  | ITextInputValidateRule
  | IFileInputValidateRule
  | IElementPickerValidateRule
