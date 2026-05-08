import { AUTH_ENDPOINTS } from 'global-shared'

import { log } from 'src/shared/lib'

import { useHttp } from '../http/use-http'

import { useSocketConnect } from './use-socket-connect'

export const useSocketReconnect = () => {
  const { doHttpRequest } = useHttp()
  const { socketConnect } = useSocketConnect()

  const socketReconnect = async () => {
    try {
      await doHttpRequest('post', AUTH_ENDPOINTS.updateTokensPair)
      socketConnect()
    } catch (error) {
      log('error', 'Socket reconnect failed', error)
    }
  }

  return {
    socketReconnect
  }
}
