import { AuthEndpointsEnum } from 'common'

import { getHandledErrorMessage, useApi } from 'src/shared/api'
import { clg } from 'src/shared/utils'

import { useSocketConnect } from './index'

export const useSocketReconnect = () => {
  const { doRequest } = useApi()
  const { socketConnect } = useSocketConnect()

  const socketReconnect = async () => {
    try {
      await doRequest('get', AuthEndpointsEnum.UpdateTokensPair, undefined)
      socketConnect()
    } catch (error: unknown) {
      clg('error', getHandledErrorMessage(error))
    }
  }
  return { socketReconnect }
}
