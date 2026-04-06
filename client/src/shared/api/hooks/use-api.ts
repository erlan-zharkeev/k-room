import { AxiosResponse, ResponseType } from 'axios'

import { APP_LANGUAGE_HEADER, DEFAULT_APP_LANGUAGE, EndpointsType, IBackendResponse, REQ_STATUS } from 'common'

import { useApiInterceptor, axios, IDoRequestOpts, RequestPayloadType, RequestType } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'
import { useNotification } from 'src/shared/notification'
import { useSettings } from 'src/shared/settings'

export const useApi = () => {
  const notifications = useNotification()
  const { language } = useSettings()
  const { interceptError } = useApiInterceptor()

  const successMessageHandler = (response: AxiosResponse<IBackendResponse<unknown>>) => {
    if (!response) return
    const ct = response.headers?.['content-type'] ?? ''
    const isJson = ct.includes('application/json')
    if (!isJson) return

    const { text, silent } = response.data.message
    const isSuccess = response.status === REQ_STATUS.success
    const successMessageNotification = notifications.getNotification({
      message: text,
      messageType: isSuccess ? 'success' : 'warning'
    })
    if (text && !silent) {
      successMessageNotification.open()
    }
  }

  const doRequest = async <T, R extends ResponseType = 'json'>(
    type: RequestType,
    endpoint: EndpointsType,
    data: RequestPayloadType = {},
    opts: IDoRequestOpts<R> = {}
  ): Promise<R extends 'json' ? AxiosResponse<IBackendResponse<T>> : AxiosResponse<Blob>> => {
    const { contentType = 'application/json', responseType = 'json' } = opts || {}

    try {
      const response = await axios.request({
        method: type,
        url: `${CLIENT_ENV.apiBaseUrl}${endpoint}`,
        headers: {
          'Content-Type': contentType,
          [APP_LANGUAGE_HEADER]: language ?? DEFAULT_APP_LANGUAGE
        },
        responseType,
        ...(type === 'get' ? { params: data } : { data })
      })

      successMessageHandler(response)

      if (response && response.status === REQ_STATUS.success) {
        return response
      }
      throw new Error('No response')
    } catch (error) {
      throw await interceptError(error)
    }
  }

  return {
    doRequest
  }
}
