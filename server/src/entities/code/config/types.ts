export interface ICodeElement {
  value: string
  expiresAt: number
}

export interface ICodeMethod {
  query: ICodeElement
  email: ICodeElement
  sms: ICodeElement
}

export interface ICodePurpose {
  passwordRecovery: ICodeMethod
}

export interface ICodeSchema {
  codes: ICodePurpose
  nextRequestPossibleAt: number
}
