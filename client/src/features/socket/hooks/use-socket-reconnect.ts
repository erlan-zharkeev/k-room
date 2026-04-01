import { AuthEndpointsEnum } from 'common'

import { useApi } from 'src/shared/api'

import { useSocketConnect } from './index'

export const useSocketReconnect = () => {
  const { doRequest } = useApi()
  const { socketConnect } = useSocketConnect()

  const socketReconnect = async () => {
    try {
      await doRequest('get', AuthEndpointsEnum.UpdateTokensPair, undefined)
      socketConnect()
    } catch {}
  }
  return { socketReconnect }
}
