import confirmation from './confirmation'
import passwordRepairSentCode from './passwordRepairSentCode'

export enum LettersType {
  confirmation = 'confirmation',
  'password-repair-sent-code' = 'passwordRepairSentCode'
}

export interface Letters {
  confirmation: (payload: { appName: string; link: string; logoSrc: string; host: string }) => string
  passwordRepairSentCode: (payload: { appName: string; logoSrc: string; host: string; code: string | number }) => string
}

const letters: Letters = { confirmation, passwordRepairSentCode }

export default letters
