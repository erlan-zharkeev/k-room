import { AuthEndpointsEnum } from 'common'

import { useSocketConnect } from 'src/features/socket/hooks/use-socket-connect'

import { getHandledErrorMessage, useApi } from 'src/shared/api'
import { clg } from 'src/shared/utils'

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
