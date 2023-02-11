import confirmation from './confirmation'

export type LettersType = 'confirmation'

export interface Letters {
  confirmation: (payload: { appName: string; link: string; logoSrc: string; host: string }) => string
}

const letters: Letters = { confirmation }

export default letters
