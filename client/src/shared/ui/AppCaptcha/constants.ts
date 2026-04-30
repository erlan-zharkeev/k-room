import type { IAppCaptchaProps } from './types'

export const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script'
export const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export const APP_CAPTCHA_DEFAULT_PROPS = {
  resetKey: 0
} satisfies Partial<IAppCaptchaProps>
