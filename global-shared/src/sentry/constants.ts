export const SENTRY_DSN_CLIENT =
  'https://44c694371e256246deded8abd8c2288e@o4511099405139968.ingest.us.sentry.io/4511596624019456'

export const SENTRY_IGNORED_SUBSTRINGS = [
  'non authorized',
  'unauthorized',
  'forbidden',
  'not found',
  'failed to fetch',
  'network error',
  'load failed',
  'the user aborted a request'
] as const
