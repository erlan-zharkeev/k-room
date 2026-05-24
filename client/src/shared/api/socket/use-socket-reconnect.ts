import { log } from 'src/shared/lib'

import { refreshAuthTokens, shouldSkipAuthRefresh } from '../http/auth-refresh'

import { useSocketConnect } from './use-socket-connect'

export const useSocketReconnect = () => {
  const { socketConnect } = useSocketConnect()

  const socketReconnect = async () => {
    if (shouldSkipAuthRefresh()) return

    try {
      await refreshAuthTokens()
      socketConnect()
    } catch (error) {
      log('error', 'Socket reconnect failed', error)
    }
  }

  return {
    socketReconnect
  }
}
