import { AxiosError } from 'axios'

import { isBackendResponse } from './is-backend-response'

export const extractErrorPayload = async (error: AxiosError) => {
  const { response } = error
  if (!response) return null

  const { data } = response

  if (data instanceof Blob) {
    if (data.type?.includes('application/json')) {
      try {
        const parsed = JSON.parse(await data.text())

        return isBackendResponse(parsed) ? parsed : null
      } catch {
        return null
      }
    }

    return null
  }

  return isBackendResponse(data) ? data : null
}
