import { MailerPayload } from '..'
import { ENV } from '../../../app/config/constants'
import { confirmation } from './confirmation'
import { passwordRepairSentCode } from './password-repair-sent-code'

interface CommonPayload {
  appName: string
  host: string
}

export const commonPayload: CommonPayload = {
  appName: ENV.APP_NAME,
  host: `${ENV.CLIENT_URL}/sign-in`
}

export type LettersName = 'confirmation' | 'password-repair-sent-code'

export interface ConfirmationLetterPayload {
  link: string
}
export interface PasswordRepairSentCodeLetterPayload {
  code: string | number
}

export interface LettersPayload {
  confirmation: ConfirmationLetterPayload
  ['password-repair-sent-code']: PasswordRepairSentCodeLetterPayload
}

type PayloadForGenerateHTML<T extends LettersName> = LettersPayload[T]

export const getAdditionalMailData = <T extends LettersName>(
  letterName: T,
  payload: PayloadForGenerateHTML<T>
): Omit<MailerPayload, 'to'> => {
  let subject
  let html
  switch (letterName) {
    case 'confirmation':
      subject = 'Email confirmation'
      html = confirmation(payload as ConfirmationLetterPayload)
      break
    case 'password-repair-sent-code':
      subject = 'Password recovery'
      html = passwordRepairSentCode(payload as PasswordRepairSentCodeLetterPayload)
      break
    default:
      subject = ''
      html = ''
      break
  }
  return { subject, html }
}
