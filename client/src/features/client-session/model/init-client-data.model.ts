import { USER_ENDPOINTS, type GetUserDataResponseType } from 'global-shared'

import { useUser } from 'src/entities/user'
import { isHttpError, useHttp, useSocketConnect, useSocketConnectionMonitor } from 'src/shared/api'
import { log } from 'src/shared/lib'

let clientDataInitPromise: Promise<void> | null = null

const initializeClientData = async () => {
  const { doHttpRequest } = useHttp()
  const { reset: resetUser, update } = useUser()
  const { socketConnect } = useSocketConnect()
  const { initializeSocketConnectionMonitor } = useSocketConnectionMonitor()

  const restoreUserSession = async () => {
    try {
      const response = await doHttpRequest<GetUserDataResponseType>('get', USER_ENDPOINTS.getUserData)
      const { email, id, role, nickname } = response.data.payload

      await update({ email, id, role, nickname })
      socketConnect()
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
  clientDataInitPromise ??= initializeClientData()

  return clientDataInitPromise
}
