export interface FormRule {
  error: string
}

export interface FormPatternRule extends FormRule {
  pattern?: RegExp
}

export interface FormRequiredPatternRule extends FormRule {
  pattern: RegExp
}

export interface FormField<TValue, TRule extends FormRule> {
  value: TValue
  rules: TRule[]
}
