import {
  MB_IN_BYTES,
  MEDIA_VALIDATION_OPTIONS_MAP,
  MESSAGE_ATTACHMENT_LIMIT,
  SECOND_IN_MS,
  SENTRY_DSN_CLIENT
} from 'global-shared'

import { SERVER_ENV } from './env'

export const SENTRY_DSN_SERVER =
  'https://10300da01036d6b225c176235329fb13@o4511099405139968.ingest.us.sentry.io/4511596467716096'

export const SOCKET_MAX_HTTP_BUFFER_SIZE =
  MESSAGE_ATTACHMENT_LIMIT * MEDIA_VALIDATION_OPTIONS_MAP.video.maxMb * MB_IN_BYTES

export const SOCKET_OPTIONS = {
  path: SERVER_ENV.socketPath,
  maxHttpBufferSize: SOCKET_MAX_HTTP_BUFFER_SIZE,
  cors: {
    origin: SERVER_ENV.origins,
    credentials: true
  }
} as const

const createSentryEnvelopeUrl = (dsn: string) => {
  const url = new URL(dsn)

  url.pathname = `/api${url.pathname}/envelope/`
  url.searchParams.set('sentry_version', '7')
  url.searchParams.set('sentry_key', url.username)
  url.username = ''
  url.password = ''

  return url.toString()
}

export const SENTRY_CLIENT_ENVELOPE_URL = createSentryEnvelopeUrl(SENTRY_DSN_CLIENT)
export const SENTRY_TUNNEL_MAX_BODY_BYTES = MB_IN_BYTES
export const SENTRY_TUNNEL_TIMEOUT_MS = 5 * SECOND_IN_MS
