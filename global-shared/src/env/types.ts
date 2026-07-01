export interface EnvVariables {
  APP_HOST: string
  API_HOST: string
  MONGO_ADMIN_HOST: string
  MONGO_HOST: string
  MONGO_ADMIN_MONGODB_URL: string
  MONGO_ADMIN_USERNAME: string
  MONGO_ADMIN_PASSWORD: string
  COOKIE_DOMAIN: string
  SENTRY_ENVIRONMENT: string
  SENTRY_ENABLED: string
  FIREBASE_API_KEY: string
  RESEND_API_KEY: string
  VAPID_PRIVATE_KEY?: string
  VAPID_SUBJECT?: string
  ADMIN_USERNAME: string
  ADMIN_PASSWORD: string
  ACCESS_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  EMAIL_CONFIRM_SECRET: string
  REDIS_URL?: string
  TURNSTILE_SITE_KEY?: string
  TURNSTILE_SECRET_KEY?: string
  CLIENT_BLOCKED_APP_VERSIONS?: string
}

export interface EnvSharedVariables {
  APP_NAME: string
  SERVER_PORT: string
  CLIENT_PORT: string
  SOCKET_PATH: string
  API_PATH: string
  ADMIN_ROOT_PATH: string
  ADMIN_COOKIE: string
  SUPPORT_EMAIL: string
  VAPID_PUBLIC_KEY?: string
  CLIENT_APP_VERSION?: string
}

export type EnvKey = keyof EnvVariables | keyof EnvSharedVariables

export type EnvSource = Record<string, string | undefined>

export interface ReadEnvOptions {
  runtimeEnv?: EnvSource
  secretEnv?: EnvSource
}

export interface SecretEnvFileReader {
  existsSync(path: string): boolean
  readFileSync(path: string, encoding: 'utf-8'): string
}
