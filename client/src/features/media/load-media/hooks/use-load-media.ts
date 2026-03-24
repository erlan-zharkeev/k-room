import { EndpointsType, MediaEndpointsEnum, StatusEnum } from 'common-types'

import { getHandledErrorMessage, isApiError, useApi } from 'src/shared/api'

import { useDeleteMedia } from '../../delete-media'
import { useSaveMedia } from '../../save-media'
import { transformHeadersToMediaData } from '../lib'

export const useLoadMedia = () => {
  const { doRequest } = useApi()
  const { deleteMedia } = useDeleteMedia()

  const loadMediaHeaders = async (filename: string) => {
    const response = await doRequest('head', `${MediaEndpointsEnum.GetMediaFile}/${filename}` as EndpointsType)
    return transformHeadersToMediaData(response)
  }

  const requestMedia = (filename: string) => {
    return doRequest<never, 'blob'>(
      'get',
      `${MediaEndpointsEnum.GetMediaFile}/${filename}` as EndpointsType,
      undefined,
      { responseType: 'blob' }
    )
  }

  const loadMedia = async (filename: string): Promise<void> => {
    const { saveMedia } = useSaveMedia()
    try {
      const response = await requestMedia(filename)
      const mediaData = transformHeadersToMediaData(response)
      await saveMedia({ id: filename, blob: response.data, ...mediaData })
    } catch (error: unknown) {
      if (isApiError(error) && error.status === StatusEnum.NotFound) {
        deleteMedia(filename)
      }
    }
  }

  const getMediaStream = async (filename: string): Promise<Blob | undefined> => {
    try {
      const response = await requestMedia(filename)
      return response.data
    } catch (error: unknown) {
      getHandledErrorMessage(error)
      return undefined
    }
  }

  return { loadMedia, loadMediaHeaders, getMediaStream }
}
