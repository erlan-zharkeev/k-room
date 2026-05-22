import { MEDIA_ENDPOINTS, REQ_STATUS, type Endpoints } from 'global-shared'

import { isHttpError, useHttp } from 'src/shared/api'

import { transformHeadersToMediaData } from '../lib/transform-headers-to-media-data'

import { useMedia } from './use-media.model'

export const useLoadMedia = () => {
  const { doHttpRequest } = useHttp()
  const { put } = useMedia()

  const getMediaEndpoint = (filename: string) => `${MEDIA_ENDPOINTS.getMediaFile}/${filename}` as Endpoints

  const loadMediaHeaders = async (filename: string) => {
    const response = await doHttpRequest('head', getMediaEndpoint(filename))

    return transformHeadersToMediaData(response)
  }

  const requestMedia = (filename: string) => {
    return doHttpRequest<never, 'blob'>('get', getMediaEndpoint(filename), undefined, {
      responseType: 'blob'
    })
  }

  const loadMedia = async (filename: string) => {
    try {
      const response = await requestMedia(filename)
      const mediaData = transformHeadersToMediaData(response)

      await put({ id: filename, blob: response.data, ...mediaData })
    } catch (error) {
      if (isHttpError(error) && error.status === REQ_STATUS.notFound) {
        await put({
          id: filename,
          lastChecked: Date.now(),
          status: 'missing'
        })

        return
      }

      throw error
    }
  }

  const getMediaStream = async (filename: string) => {
    try {
      const response = await requestMedia(filename)

      return response.data
    } catch {
      return undefined
    }
  }

  return { loadMedia, loadMediaHeaders, getMediaStream }
}
