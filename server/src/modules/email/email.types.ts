import type { AppLanguageType } from 'global-shared'

export interface IRenderEmailConfirmationHtmlParams {
  appName: string
  confirmUrl: string
  nickname?: string
}

export interface ISendEmailConfirmationEmailPayload {
  email: string
  language: AppLanguageType
  token: string
  nickname?: string
}

export interface ISendEmailCodeEmailPayload {
  email: string
  code: string
  language: AppLanguageType
  nickname?: string
}
