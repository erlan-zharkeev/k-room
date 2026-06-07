import { MESSAGE_SCROLL_DEBUG_LOG_LABEL } from '../config/constants'

export const logMessageScrollDebug = (event: string, payload: Record<string, unknown>) => {
  console.log(MESSAGE_SCROLL_DEBUG_LOG_LABEL, event, {
    timestamp: new Date().toISOString(),
    ...payload
  })
}
