import type { AxiosResponse } from 'axios'
import type { MediaKindType } from 'global-shared'

import { getHeaderValue } from 'src/shared/api'
import type { IDbMedia } from 'src/shared/lib'

export const transformHeadersToMediaData = (res: AxiosResponse): Omit<IDbMedia, 'blob' | 'id'> => {
  return {
    etag: getHeaderValue(res.headers.etag),
    contentType: getHeaderValue(res.headers['content-type']),
    lastModified: getHeaderValue(res.headers['last-modified']),
    lastChecked: Date.now(),
    kind: getHeaderValue(res.headers.kind) as MediaKindType,
    status: 'ready'
  }
}
