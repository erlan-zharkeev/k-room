export interface IRenderEmailConfirmationHtmlParams {
  appName: string
  confirmUrl: string
  nickname?: string
}

export interface ISendEmailConfirmationEmailPayload {
  email: string
  token: string
  nickname?: string
}

export interface ISendEmailCodeEmailPayload {
  email: string
  code: string
  nickname?: string
}
