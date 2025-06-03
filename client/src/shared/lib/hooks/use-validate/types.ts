import { booleanValidateRules, stringValidateRules, arrayValidateRules } from './rules'

type ValidateBooleanRule = keyof typeof booleanValidateRules
type ValidateTextRule = keyof typeof stringValidateRules
type ValidateArrayRule = keyof typeof arrayValidateRules

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

export interface ElementPickerValidateRule {
  name: ValidateArrayRule
}

export type ValidateRule =
  | SwitchValidateRule
  | TextInputValidateRule
  | FileInputValidateRule
  | ElementPickerValidateRule
