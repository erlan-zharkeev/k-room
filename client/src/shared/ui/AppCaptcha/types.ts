import type { SecurityActionType } from 'global-shared'
import type { Ref } from 'vue'

export interface IAppCaptchaProps {
  action: SecurityActionType
  resetKey?: number
}

export interface IUseAppCaptchaParams {
  action: SecurityActionType
  model: Ref<string>
  resetKey: Ref<number>
}

export interface ITurnstileRenderOptions {
  sitekey: string
  action?: SecurityActionType
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

export interface ITurnstileApi {
  render: (container: HTMLElement, options: ITurnstileRenderOptions) => string
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}
