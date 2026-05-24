import { USER_ENDPOINTS, type GetUserDataResponse } from 'global-shared'

import { useUser } from 'src/entities/user'
import { isHttpError, useHttp, useSocketConnectionMonitor } from 'src/shared/api'
import { log } from 'src/shared/lib'

import { useClientSession } from './use-client-session.model'

let clientDataInitPromise: Promise<void> | null = null

const initializeClientData = async () => {
  const { doHttpRequest } = useHttp()
  const { reset: resetUser } = useUser()
  const { activateClientSession } = useClientSession()
  const { initializeSocketConnectionMonitor } = useSocketConnectionMonitor()

  const restoreUserSession = async () => {
    try {
      const response = await doHttpRequest<GetUserDataResponse>('get', USER_ENDPOINTS.getUserData)

      await activateClientSession(response.data.payload, false)
    } catch (error) {
      if (isHttpError(error) && error.status === 401) {
        await resetUser()
        return
      }

      if (!isHttpError(error) || error.status !== 401) {
        log('error', 'Restore user session failed', error)
      }
    }
  }

  initializeSocketConnectionMonitor()
  await restoreUserSession()
}

export const initClientData = () => {
  if (!clientDataInitPromise) {
    clientDataInitPromise = initializeClientData()
  }

  return clientDataInitPromise
}
