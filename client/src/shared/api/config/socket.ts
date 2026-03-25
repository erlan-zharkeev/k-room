import { DEFAULT_APP_LANGUAGE, RouteNamesEnum } from 'common-types'
import { io } from 'socket.io-client'

import { settingsStore } from 'src/entities/settings/hooks/use-settings'

import { CLIENT_ENV } from 'src/shared/config'

const socketBaseUrl = import.meta.env.DEV ? `${CLIENT_ENV.apiHost}:${CLIENT_ENV.serverPort}` : CLIENT_ENV.apiHost

export const socket = io(`${socketBaseUrl}/`, {
  transports: ['websocket'],
  secure: true,
  forceNew: false,
  autoConnect: false,
  auth: {
    language: DEFAULT_APP_LANGUAGE
  },
  path: RouteNamesEnum.SocketPath,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1000,
  reconnectionAttempts: CLIENT_ENV.maxReconnectAttempts
})

settingsStore.get().then((settings) => {
  socket.auth = {
    ...(typeof socket.auth === 'object' && socket.auth ? socket.auth : {}),
    language: settings?.language ?? DEFAULT_APP_LANGUAGE
  }
})
