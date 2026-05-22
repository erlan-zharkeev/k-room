import type { AppLanguage } from 'global-shared'

declare global {
  namespace Express {
    interface Request {
      language: AppLanguage
      authUserId?: string
    }
  }
}

export {}
