import { MEDIA_ENDPOINTS } from 'global-shared'

import { MESSAGE_MEDIA_IMAGE_FILENAME_PREFIX } from '../config/constants'

export const resolveMessageImageSrc = (src: string) => {
  if (!src.startsWith(MESSAGE_MEDIA_IMAGE_FILENAME_PREFIX)) {
    return src
  }

  return `${__CLIENT_ENV_DATA__.apiBaseUrl}${MEDIA_ENDPOINTS.getMediaFile}/${src}`
}
