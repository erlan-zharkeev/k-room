export interface LoginFormRule {
  pattern: RegExp
  error: string
}

export interface LoginFormField {
  value: string
  rules: LoginFormRule[]
}

export interface LoginFormData {
  login: LoginFormField
  password: LoginFormField
}
