export interface RenderEmailConfirmationHtmlParams {
  appName: string
  confirmUrl: string
  nickname?: string
}

export interface SendEmailConfirmationEmailPayload {
  email: string
  token: string
  nickname?: string
}

export interface SendEmailCodeEmailPayload {
  email: string
  code: string
  nickname?: string
}
