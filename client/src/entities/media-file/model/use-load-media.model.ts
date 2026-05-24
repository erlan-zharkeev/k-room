import { MEDIA_ENDPOINTS, REQ_STATUS, type Endpoints } from 'global-shared'

import { isHttpError, useHttp } from 'src/shared/api'

import { MEDIA_NO_CACHE_REQUEST_HEADERS } from '../config/constants'
import { transformHeadersToMediaData } from '../lib/transform-headers-to-media-data'

import { useMedia } from './use-media.model'

let mediaRequestAbortController = new AbortController()

export const abortMediaRequests = () => {
  mediaRequestAbortController.abort()
}

export const resetMediaRequests = () => {
  mediaRequestAbortController = new AbortController()
}

export const useLoadMedia = () => {
  const { doHttpRequest } = useHttp()
  const { put } = useMedia()

  const getMediaEndpoint = (mediaId: string) => `${MEDIA_ENDPOINTS.getMediaFile}/${mediaId}` as Endpoints

  const loadMediaHeaders = async (mediaId: string) => {
    const response = await doHttpRequest('head', getMediaEndpoint(mediaId), undefined, {
      headers: MEDIA_NO_CACHE_REQUEST_HEADERS,
      signal: mediaRequestAbortController.signal
    })

    return transformHeadersToMediaData(response)
  }

  const requestMedia = (mediaId: string) => {
    return doHttpRequest<never, 'blob'>('get', getMediaEndpoint(mediaId), undefined, {
      headers: MEDIA_NO_CACHE_REQUEST_HEADERS,
      responseType: 'blob',
      signal: mediaRequestAbortController.signal
    })
  }

  const loadMedia = async (mediaId: string) => {
    try {
      const response = await requestMedia(mediaId)
      const mediaData = transformHeadersToMediaData(response)

      await put({ id: mediaId, blob: response.data, ...mediaData })
    } catch (error) {
      if (isHttpError(error) && error.status === REQ_STATUS.notFound) {
        await put({
          id: mediaId,
          lastChecked: Date.now(),
          status: 'missing'
        })

        return
      }

      throw error
    }
  }

  const getMediaStream = async (mediaId: string) => {
    try {
      const response = await requestMedia(mediaId)

      return response.data
    } catch {
      return undefined
    }
  }

  return { loadMedia, loadMediaHeaders, getMediaStream }
}
