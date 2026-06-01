import type { INmorphNotification } from '@nmorph/nmorph-ui-kit'

export type AppToastStack = 'system' | 'message' | 'call'

export type AppToastNotification = INmorphNotification & {
  showDurationValue?: boolean
}

export type AppToastInput = AppToastNotification & {
  isCritical?: boolean
}
