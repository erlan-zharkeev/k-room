import type { AxiosResponse } from 'axios'
import { MEDIA_KIND_HEADER_NAME, type MediaKind } from 'global-shared'

import { getHeaderValue } from 'src/shared/api'
import type { MediaRecord } from 'src/shared/lib'

export const transformHeadersToMediaData = (res: AxiosResponse): Omit<MediaRecord, 'blob' | 'id'> => {
  return {
    etag: getHeaderValue(res.headers.etag),
    contentType: getHeaderValue(res.headers['content-type']),
    lastModified: getHeaderValue(res.headers['last-modified']),
    lastChecked: Date.now(),
    kind: getHeaderValue(res.headers[MEDIA_KIND_HEADER_NAME]) as MediaKind,
    status: 'ready'
  }
}
