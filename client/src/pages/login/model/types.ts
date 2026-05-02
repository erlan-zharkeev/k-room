export interface ILoginFormRule {
  pattern: RegExp
  error: string
}

export interface ILoginFormField {
  value: string
  rules: ILoginFormRule[]
}

export interface ILoginFormData {
  login: ILoginFormField
  password: ILoginFormField
}
