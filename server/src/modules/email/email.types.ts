import type { AppLanguage } from 'global-shared'

export interface RenderEmailConfirmationHtmlParams {
  appName: string
  confirmEmailButtonText: string
  confirmationText: string
  confirmUrl: string
  fallbackLinkText: string
  greeting: string
}

export interface BuildEmailGreetingParams {
  greeting: string
  nickname?: string
  punctuation: '!' | '.'
}

export interface RenderEmailCodeHtmlParams {
  code: string
  greeting: string
  ignoreText: string
  text: string
  title: string
}

export interface SendEmailConfirmationEmailPayload {
  email: string
  language: AppLanguage
  token: string
  nickname?: string
}

export interface SendEmailCodeEmailPayload {
  email: string
  language: AppLanguage
  code: string
  nickname?: string
}
