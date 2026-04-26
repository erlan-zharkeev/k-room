import { USER_ENDPOINTS, type IGetUserDataResponse } from 'global-shared'

import { useSettings } from 'src/entities/setting'
import { useUser } from 'src/entities/user'
import { isApiError, useApi, useSocketConnect, useSocketConnectionMonitor } from 'src/shared/api'
import { log } from 'src/shared/lib'

let clientDataInitPromise: Promise<void> | null = null

const initializeClientData = async () => {
  const { doRequest } = useApi()
  const { initialize: initializeUser, reset: resetUser, shallowUpdate } = useUser()
  const settingsStore = useSettings()
  const { socketConnect } = useSocketConnect()
  const { initializeSocketConnectionMonitor } = useSocketConnectionMonitor()

  const restoreUserSession = async () => {
    try {
      const response = await doRequest<IGetUserDataResponse>('get', USER_ENDPOINTS.getUserData)
      const { email, id, role, username } = response.data.payload

      await shallowUpdate({ email, id, role, username })
      socketConnect()
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        await resetUser()
        return
      }

      if (!isApiError(error) || error.status !== 401) {
        log('error', 'Restore user session failed', error)
      }
    }
  }

  await Promise.all([settingsStore.initialize(), initializeUser()])
  initializeSocketConnectionMonitor()
  await restoreUserSession()
}

export const initClientData = () => {
  clientDataInitPromise ??= initializeClientData()

  return clientDataInitPromise
}
