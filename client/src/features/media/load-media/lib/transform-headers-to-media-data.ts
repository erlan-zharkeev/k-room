import { AxiosResponse } from 'axios'

import { MediaKindType } from 'common'

import { IDbMedia } from 'src/shared/config'

export const transformHeadersToMediaData = (res: AxiosResponse): Omit<IDbMedia, 'id' | 'blob'> => {
  return {
    etag: res.headers.etag ?? '',
    contentType: res.headers['content-type'] ?? '',
    lastModified: res.headers['last-modified'] ?? '',
    lastChecked: Date.now(),
    kind: res.headers.kind as MediaKindType
  }
}
