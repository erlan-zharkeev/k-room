import { AUTH_ENDPOINTS } from 'global-shared'

import { log } from 'src/shared/lib'

import { useApi } from '../http/use-api'

import { useSocketConnect } from './use-socket-connect'

export const useSocketReconnect = () => {
  const { doRequest } = useApi()
  const { socketConnect } = useSocketConnect()

  const socketReconnect = async () => {
    try {
      await doRequest('post', AUTH_ENDPOINTS.updateTokensPair)
      socketConnect()
    } catch (error) {
      log('error', 'Socket reconnect failed', error)
    }
  }

  return {
    socketReconnect
  }
}
