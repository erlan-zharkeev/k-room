export interface CodeElement {
  value: string
  expiresAt: number
}

export interface CodeMethod {
  query: CodeElement
  email: CodeElement
  sms: CodeElement
}

export interface CodePurpose {
  passwordRecovery: CodeMethod
}

export interface CodeSchema {
  codes: CodePurpose
  nextRequestPossibleAt: number
}
