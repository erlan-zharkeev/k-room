import type { SecurityActionType } from 'global-shared'

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
