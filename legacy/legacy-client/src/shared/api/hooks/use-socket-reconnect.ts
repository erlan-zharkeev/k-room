import { AUTH_ENDPOINTS } from 'common'

import { useApi } from './use-api'
import { useSocketConnect } from './use-socket-connect'

export const useSocketReconnect = () => {
  const { doRequest } = useApi()
  const { socketConnect } = useSocketConnect()

  const socketReconnect = async () => {
    try {
      await doRequest('post', AUTH_ENDPOINTS.updateTokensPair, undefined)
      socketConnect()
    } catch {
      //
    }
  }

  return { socketReconnect }
}
