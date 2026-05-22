import { AppLanguage } from 'common'

declare module 'express-serve-static-core' {
  interface Request {
    language: AppLanguage
  }
}
