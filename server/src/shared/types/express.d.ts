import type { AppLanguageType } from 'global-shared'

declare global {
  namespace Express {
    interface Request {
      language: AppLanguageType
      authUserId?: string
    }
  }
}

export {}
