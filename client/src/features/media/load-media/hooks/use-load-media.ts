import { EndpointsType, MEDIA_ENDPOINTS, StatusEnum } from 'common'

import { useSaveMedia, useDeleteMedia, transformHeadersToMediaData } from 'src/features/media'

import { isApiError, useApi } from 'src/shared/api'

export const useLoadMedia = () => {
  const { doRequest } = useApi()
  const { deleteMedia } = useDeleteMedia()

  const loadMediaHeaders = async (filename: string) => {
    const response = await doRequest('head', `${MEDIA_ENDPOINTS.getMediaFile}/${filename}` as EndpointsType)
    return transformHeadersToMediaData(response)
  }

  const requestMedia = (filename: string) => {
    return doRequest<never, 'blob'>('get', `${MEDIA_ENDPOINTS.getMediaFile}/${filename}` as EndpointsType, undefined, {
      responseType: 'blob'
    })
  }

  const loadMedia = async (filename: string): Promise<void> => {
    const { saveMedia } = useSaveMedia()
    try {
      const response = await requestMedia(filename)
      const mediaData = transformHeadersToMediaData(response)
      await saveMedia({ id: filename, blob: response.data, ...mediaData })
    } catch (error) {
      if (isApiError(error) && error.status === StatusEnum.NotFound) {
        deleteMedia(filename)
      }
    }
  }

  const getMediaStream = async (filename: string): Promise<Blob | undefined> => {
    try {
      const response = await requestMedia(filename)
      return response.data
    } catch {
      return undefined
    }
  }

  return { loadMedia, loadMediaHeaders, getMediaStream }
}
