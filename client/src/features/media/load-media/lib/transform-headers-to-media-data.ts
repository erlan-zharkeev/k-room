import { AxiosResponse } from 'axios'
import { MediaKindType } from 'common-types'

import { IDbMedia } from 'src/shared/config'

export const transformHeadersToMediaData = (res: AxiosResponse): Omit<IDbMedia, 'id' | 'blob'> => {
  return {
    etag: res.headers.etag ?? null,
    contentType: res.headers['content-type'] ?? null,
    lastModified: res.headers['last-modified'] ?? null,
    kind: res.headers.kind as MediaKindType
  }
}
