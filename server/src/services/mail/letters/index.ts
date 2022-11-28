import confirmation from './confirmation'

export type LettersType = 'confirmation'

interface Letters {
  confirmation: (payload: { appName: string; link: string }) => string
}

const letters: Letters = { confirmation }

export default letters
