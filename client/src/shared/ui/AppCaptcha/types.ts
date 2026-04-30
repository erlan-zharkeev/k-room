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
