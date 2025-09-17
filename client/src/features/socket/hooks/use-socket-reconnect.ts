import { AuthEndpointsEnum } from 'common-types'

import { useApi, useApiInterсeptor } from 'src/shared/api'

import { useSocketConnect } from './use-socket-connect'

export const useSocketReconnect = () => {
  const { interceptError } = useApiInterсeptor()
  const { doRequest } = useApi()
  const { socketConnect } = useSocketConnect()

  const socketReconnect = async () => {
    try {
      await doRequest('get', AuthEndpointsEnum.UpdateTokensPair, undefined)
      socketConnect()
    } catch (e) {
      interceptError(e)
    }
  }
  return { socketReconnect }
}
