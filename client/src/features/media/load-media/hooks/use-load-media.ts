import { EndpointsType, MediaEndpointsEnum } from 'common-types'

import { useApi } from 'src/shared/api'

import { useSaveMedia } from '../../save-media'
import { transformHeadersToMediaData } from '../lib'

export const useLoadMedia = () => {
  const { doRequest } = useApi()

  const loadMediaHeaders = async (filename: string) => {
    const response = await doRequest('head', `${MediaEndpointsEnum.GetMediaFile}/${filename}` as EndpointsType)
    return transformHeadersToMediaData(response)
  }

  const loadMedia = async (filename: string): Promise<string> => {
    const { saveMedia } = useSaveMedia()

    const response = await doRequest<never, 'blob'>(
      'get',
      `${MediaEndpointsEnum.GetMediaFile}/${filename}` as EndpointsType,
      undefined,
      { responseType: 'blob' }
    )

    const mediaData = transformHeadersToMediaData(response)
    await saveMedia({ id: filename, blob: response.data, ...mediaData })
    const url = URL.createObjectURL(response.data)
    return url
  }

  return { loadMedia, loadMediaHeaders }
}
