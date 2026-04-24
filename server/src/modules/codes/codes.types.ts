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
  _id?: string
  codes: ICodePurpose
  nextRequestPossibleAt: number
}
