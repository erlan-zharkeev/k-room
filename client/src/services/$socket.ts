import { AuthTokens, RouteNames, SocketActions } from 'common-types'
import { io } from 'socket.io-client'
import Cookies from 'js-cookie'
import { AppDispatch } from 'src/store'
import apiMethods from './api-methods'
import { setReconnectingStatus } from 'src/store/systemSlice'

const { DEV, VITE_SERVER_PORT, VITE_MAX_RECONNECT_ATTEMPTS } = import.meta.env
const initConnectionPath = DEV ? `:${VITE_SERVER_PORT}` : ''

export const $socket = io(`${initConnectionPath}/`, {
  forceNew: false,
  path: RouteNames.SOCKET_PATH,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: VITE_MAX_RECONNECT_ATTEMPTS,
  auth: { token: Cookies.get(AuthTokens.accessToken), refreshToken: Cookies.get(AuthTokens.refreshToken) }
})

export const socketReconnect = async (dispatch: AppDispatch) => {
  await dispatch(apiMethods.auth.updateTokensPair())
  $socket.auth = { token: Cookies.get('jwt') }
  $socket.connect()
  $socket.emit(SocketActions.INITIALIZE)
  dispatch(setReconnectingStatus(false))
}
