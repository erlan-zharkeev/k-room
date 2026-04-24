import type { AppLanguageType } from 'shared'

declare global {
  namespace Express {
    interface Request {
      language?: AppLanguageType
      authUserId?: string
    }
  }
}

export {}
