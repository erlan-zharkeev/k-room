import { RouteNamesEnum } from 'common-types'
import Cookies from 'js-cookie'
import { io } from 'socket.io-client'

const { DEV, VITE_SERVER_PORT, VITE_MAX_RECONNECT_ATTEMPTS } = import.meta.env
const initConnectionPath = DEV ? `:${VITE_SERVER_PORT}` : ''

export const socket = io(`${initConnectionPath}/`, {
  secure: true,
  forceNew: false,
  path: RouteNamesEnum.SocketPath,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: VITE_MAX_RECONNECT_ATTEMPTS,
  auth: { token: Cookies.get('jwt'), refreshToken: Cookies.get('jwt-refresh') }
})
