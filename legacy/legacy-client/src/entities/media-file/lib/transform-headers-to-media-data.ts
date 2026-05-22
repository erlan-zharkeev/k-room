import { AxiosResponse } from 'axios'

import { MediaKind } from 'common'

import { DbMedia } from 'src/shared/config'

const getHeaderValue = (value: AxiosResponse['headers'][string]): string => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return typeof value === 'string' ? value : ''
}

export const transformHeadersToMediaData = (res: AxiosResponse): Omit<DbMedia, 'id' | 'blob'> => {
  return {
    etag: getHeaderValue(res.headers.etag),
    contentType: getHeaderValue(res.headers['content-type']),
    lastModified: getHeaderValue(res.headers['last-modified']),
    lastChecked: Date.now(),
    kind: getHeaderValue(res.headers.kind) as MediaKind
  }
}
