import { AxiosError } from 'axios'
import { MEDIA_ENDPOINTS } from 'global-shared'

export const isMediaRequestError = (error: AxiosError) => {
  return Boolean(error.config?.url?.includes(MEDIA_ENDPOINTS.getMediaFile))
}
