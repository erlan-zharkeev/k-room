import type { SecurityAction } from 'global-shared'
import type { Ref } from 'vue'

export interface AppCaptchaProps {
  action: SecurityAction
  resetKey?: number
}

export interface UseAppCaptchaParams {
  action: SecurityAction
  model: Ref<string>
  resetKey: Ref<number>
}

export interface TurnstileRenderOptions {
  sitekey: string
  action?: SecurityAction
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

export interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}
