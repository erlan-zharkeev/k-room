import { MEDIA_ENDPOINTS, MEDIA_IMAGE_FILENAME_PREFIX } from 'global-shared'

export const resolveMessageImageSrc = (src: string) => {
  if (!src.startsWith(MEDIA_IMAGE_FILENAME_PREFIX)) {
    return src
  }

  return `${__CLIENT_ENV_DATA__.apiBaseUrl}${MEDIA_ENDPOINTS.getMediaFile}/${src}`
}
