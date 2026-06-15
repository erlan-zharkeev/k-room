import { isString, isUnknownObject } from 'global-shared'

import { DOWNLOAD_PLATFORM_IDS } from '../config/constants'
import type { DownloadPlatformId, DownloadPlatformItem, DownloadReleasesManifest } from '../config/types'

const parseDownloadPlatformItem = (platformId: DownloadPlatformId, source: unknown): DownloadPlatformItem | null => {
  if (!isUnknownObject(source)) return null

  const { label, fileName, downloadUrl } = source
  const hasLabel = isString(label)
  const hasFileName = isString(fileName)
  const hasDownloadUrl = isString(downloadUrl)
  const hasFileData = hasFileName && hasDownloadUrl
  const hasPlatformData = hasLabel && hasFileData

  if (!hasPlatformData) return null

  return {
    platformId,
    label,
    fileName,
    downloadUrl
  }
}

export const parseDownloadReleasesManifest = (source: unknown): DownloadReleasesManifest | null => {
  if (!isUnknownObject(source)) return null

  const { releasedAt, platforms } = source

  if (!isString(releasedAt) || !isUnknownObject(platforms)) return null

  const platformItems = DOWNLOAD_PLATFORM_IDS.flatMap((platformId) => {
    const platformItem = parseDownloadPlatformItem(platformId, platforms[platformId])

    return platformItem ? [platformItem] : []
  })
  const hasEveryPlatform = platformItems.length === DOWNLOAD_PLATFORM_IDS.length

  if (!hasEveryPlatform) return null

  return {
    releasedAt,
    platformItems
  }
}
