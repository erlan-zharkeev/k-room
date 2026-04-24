import { AppLanguageType } from 'common'

declare module 'express-serve-static-core' {
  interface Request {
    language: AppLanguageType
  }
}
