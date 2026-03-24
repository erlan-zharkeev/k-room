import { AuthEndpointsEnum } from 'common-types'

import { ApiError, useApi } from 'src/shared/api'
import { clg } from 'src/shared/utils'

import { useSocketConnect } from './use-socket-connect'

export const useSocketReconnect = () => {
  const { doRequest } = useApi()
  const { socketConnect } = useSocketConnect()

  const socketReconnect = async () => {
    try {
      await doRequest('get', AuthEndpointsEnum.UpdateTokensPair, undefined)
      socketConnect()
    } catch (error: unknown) {
      if (error instanceof ApiError || error instanceof Error) {
        clg('error', error.message)
      }
    }
  }
  return { socketReconnect }
}
