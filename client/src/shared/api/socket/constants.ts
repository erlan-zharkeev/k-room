import { SECOND_IN_MS } from 'global-shared'

export const SOCKET_RECONNECTION_DELAY_MS = 1 * SECOND_IN_MS
export const SOCKET_MAX_RECONNECTION_DELAY_MS = 1 * SECOND_IN_MS
export const SOCKET_ACTION_ACK_TIMEOUT_MS = 15 * SECOND_IN_MS
export const SOCKET_TRANSPORT_ERROR_TOAST_THROTTLE_MS = 2 * SECOND_IN_MS

export const SOCKET_AVAILABILITY_STATUS = {
  ONLINE: 'online',
  RECONNECTING: 'reconnecting',
  OFFLINE: 'offline'
} as const
