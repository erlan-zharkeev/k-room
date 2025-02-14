import { RouteNames, SocketActions, AuthEndpoints } from 'common-types'
import Cookies from 'js-cookie'
import { io } from 'socket.io-client'
import { AppDispatch, setReconnectingStatus } from 'src/store'
import axios from 'axios'
import { apiErrorInterceptor } from './$api'

const { DEV, VITE_SERVER_PORT, VITE_MAX_RECONNECT_ATTEMPTS } = import.meta.env
const initConnectionPath = DEV ? `:${VITE_SERVER_PORT}` : ''

export const $socket = io(`${initConnectionPath}/`, {
  secure: true,
  forceNew: false,
  path: RouteNames.SOCKET_PATH,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: VITE_MAX_RECONNECT_ATTEMPTS,
  auth: { token: Cookies.get('access-token'), refreshToken: Cookies.get('refresh-token') }
})

export const socketReconnect = async (dispatch: AppDispatch) => {
  try {
    await axios.get(`/api${AuthEndpoints.UpdateTokensPair}`, { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    apiErrorInterceptor(e)
  }
  $socket.auth = { token: Cookies.get('access-token') }
  $socket.connect()
  $socket.emit<SocketActions>('initialize')
  dispatch(setReconnectingStatus(false))
}
