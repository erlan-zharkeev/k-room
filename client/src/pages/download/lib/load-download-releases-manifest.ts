import { loadPublicJson } from 'src/shared/api'

import { DOWNLOAD_RELEASES_MANIFEST_URL } from '../config/constants'
import type { DownloadReleasesManifest } from '../config/types'

import { parseDownloadReleasesManifest } from './parse-download-releases-manifest'

export const loadDownloadReleasesManifest = async (): Promise<DownloadReleasesManifest | null> => {
  const source = await loadPublicJson(DOWNLOAD_RELEASES_MANIFEST_URL)

  return parseDownloadReleasesManifest(source)
}
